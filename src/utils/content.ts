import { getCollection } from "astro:content";
import fs from "node:fs/promises";
import path from "node:path";

export interface Artist {
  id: string;
  name: string;
  profession: string;
  link: string;
  image: string;
  flipImage: string;
  allImages: string[];
  houseNumber: number;
}

export interface Course {
  slug: string;
  artistIds: string[];
  name: string;
  link: string;
  startMonth?: number;
  endMonth?: number;
  content: string;
  houseNumber: number;
  images: string[];
}

export interface Exposition {
  title: string;
  slug: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location: string;
  address: string;
  curator: string;
  openingEventTime?: string;
  openingEventDescription?: string;
  artistIds: string[];
  link?: string;
  content: string;
  heroImage: string;
  flyerImage: string;
}

async function getArtistImages(
  artistId: string,
): Promise<{ image: string; flipImage: string; allImages: string[] }> {
  const assetsDir = path.join(process.cwd(), "public/assets/artists", artistId);

  try {
    const files = await fs.readdir(assetsDir);
    const imageFiles = files.filter(isImageFile).sort();

    const allImages = imageFiles.map((file) => `/assets/artists/${artistId}/${file}`);
    const image = imageFiles[0] ? `/assets/artists/${artistId}/${imageFiles[0]}` : "";
    const flipImage = imageFiles[1] ? `/assets/artists/${artistId}/${imageFiles[1]}` : image;

    return { image, flipImage, allImages };
  } catch {
    return { image: "", flipImage: "", allImages: [] };
  }
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImageFile(file: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) => file.toLowerCase().endsWith(ext));
}

async function getCourseImages(slug: string): Promise<string[]> {
  const assetsDir = path.join(process.cwd(), "public/assets/courses", slug);

  try {
    const files = await fs.readdir(assetsDir);
    return files
      .filter(isImageFile)
      .sort()
      .map((file) => `/assets/courses/${slug}/${file}`);
  } catch {
    return [];
  }
}

async function getExpositionImages(
  slug: string,
): Promise<{ heroImage: string; flyerImage: string }> {
  const assetsDir = path.join(process.cwd(), "public/assets/expositions", slug);

  try {
    const files = await fs.readdir(assetsDir);
    const imageFiles = files.filter(isImageFile).sort();

    const heroFile = imageFiles.find((f) => f.startsWith("hero"));
    const flyerFile = imageFiles.find((f) => f.startsWith("flyer"));

    const heroImage = heroFile ? `/assets/expositions/${slug}/${heroFile}` : "";
    const flyerImage = flyerFile ? `/assets/expositions/${slug}/${flyerFile}` : "";

    return { heroImage, flyerImage };
  } catch {
    return { heroImage: "", flyerImage: "" };
  }
}

function parseArtistIds(value: string): string[] {
  if (!value) return [];
  if (value.includes(",")) {
    return value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }
  return [value];
}

export async function getArtists(): Promise<Artist[]> {
  const entries = await getCollection("artists");

  const artists = await Promise.all(
    entries.map(async (entry) => {
      const { image, flipImage, allImages } = await getArtistImages(entry.data.id);

      return {
        id: entry.data.id,
        name: entry.data.name,
        profession: entry.data.profession,
        link: entry.data.link,
        image,
        flipImage,
        allImages,
        houseNumber: entry.data.house_number,
      };
    }),
  );

  return artists.toSorted((a, b) => a.houseNumber - b.houseNumber);
}

export async function getCourses(artists: Artist[]): Promise<Course[]> {
  const allEntries = await getCollection("courses");
  const entries = allEntries.filter((entry) => !entry.data.disabled);
  const artistsMap = new Map(artists.map((artist) => [artist.id, artist]));

  const courses = await Promise.all(
    entries.map(async (entry) => {
      const artistIds = parseArtistIds(entry.data.artist_ids);

      const courseArtists = artistIds
        .map((id) => artistsMap.get(id))
        .filter((artist): artist is Artist => artist !== undefined);

      const houseNumber =
        courseArtists.length > 0
          ? Math.min(...courseArtists.map((artist) => artist.houseNumber))
          : 0;

      // Load course-specific images, fall back to combined artist images
      const slug = entry.id.replace(/\.md$/, "");
      let images = await getCourseImages(slug);
      if (images.length === 0 && courseArtists.length > 0) {
        images = courseArtists.flatMap((artist) => artist.allImages);
      }

      return {
        slug,
        artistIds,
        name: entry.data.name,
        link: entry.data.link,
        startMonth: entry.data.start_month,
        endMonth: entry.data.end_month,
        content: entry.body?.trim() ?? "",
        houseNumber,
        images: images.slice(0, 4),
      };
    }),
  );

  return courses
    .filter((course) => course.houseNumber > 0)
    .toSorted((a, b) => a.houseNumber - b.houseNumber);
}

export async function getExpositions(): Promise<Exposition[]> {
  const entries = await getCollection("expositions");

  const expositions = await Promise.all(
    entries.map(async (entry) => {
      const { heroImage, flyerImage } = await getExpositionImages(entry.data.slug);

      return {
        title: entry.data.title,
        slug: entry.data.slug,
        startDate: entry.data.start_date,
        startTime: entry.data.start_time,
        endDate: entry.data.end_date,
        endTime: entry.data.end_time,
        location: entry.data.location,
        address: entry.data.address,
        curator: entry.data.curator,
        openingEventTime: entry.data.opening_event_time,
        openingEventDescription: entry.data.opening_event_description,
        artistIds: parseArtistIds(entry.data.artist_ids),
        link: entry.data.link,
        content: entry.body?.trim() ?? "",
        heroImage,
        flyerImage,
      };
    }),
  );

  return expositions.toSorted(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

function getEndOfDay(dateString: string): Date {
  const date = new Date(dateString);
  date.setUTCHours(23, 59, 59, 999);
  return date;
}

export function getUpcomingExpositions(expositions: Exposition[]): Exposition[] {
  const now = new Date();
  return expositions
    .filter((expo) => {
      const endDate = getEndOfDay(expo.endDate ?? expo.startDate);
      return endDate >= now;
    })
    .toSorted((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function getPastExpositions(expositions: Exposition[]): Exposition[] {
  const now = new Date();
  return expositions.filter((expo) => {
    const endDate = getEndOfDay(expo.endDate ?? expo.startDate);
    return endDate < now;
  });
}
