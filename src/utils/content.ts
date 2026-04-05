import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";

// Discover all content images at build time
const allContentImages = import.meta.glob<{ default: ImageMetadata }>(
  "/content/**/*.{jpg,jpeg,png,webp}",
  { eager: true },
);

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImagePath(filePath: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) => filePath.toLowerCase().endsWith(ext));
}

function getImagesForPath(prefix: string): ImageMetadata[] {
  return Object.entries(allContentImages)
    .filter(([path]) => path.startsWith(prefix) && isImagePath(path))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, module]) => module.default);
}

export interface Artist {
  id: string;
  name: string;
  profession: string;
  link: string;
  image: ImageMetadata | null;
  flipImage: ImageMetadata | null;
  allImages: ImageMetadata[];
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
  images: ImageMetadata[];
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
  heroImage: ImageMetadata | null;
  flyerImage: ImageMetadata | null;
}

function getArtistImages(artistId: string): {
  image: ImageMetadata | null;
  flipImage: ImageMetadata | null;
  allImages: ImageMetadata[];
} {
  const images = getImagesForPath(`/content/artists/${artistId}/`);
  return {
    image: images[0] ?? null,
    flipImage: images[1] ?? images[0] ?? null,
    allImages: images,
  };
}

function getCourseImages(slug: string): ImageMetadata[] {
  return getImagesForPath(`/content/courses/${slug}/`);
}

function getExpositionImages(slug: string): {
  heroImage: ImageMetadata | null;
  flyerImage: ImageMetadata | null;
} {
  const prefix = `/content/expositions/${slug}/`;
  const entries = Object.entries(allContentImages)
    .filter(([path]) => path.startsWith(prefix) && isImagePath(path))
    .sort(([a], [b]) => a.localeCompare(b));

  let heroImage: ImageMetadata | null = null;
  let flyerImage: ImageMetadata | null = null;

  for (const [imagePath, module] of entries) {
    const filename = imagePath.slice(prefix.length).toLowerCase();
    if (filename.startsWith("hero")) heroImage = module.default;
    if (filename.startsWith("flyer")) flyerImage = module.default;
  }

  return { heroImage, flyerImage };
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

  const artists = entries.map((entry) => {
    const { image, flipImage, allImages } = getArtistImages(entry.data.id);

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
  });

  return artists.toSorted((a, b) => a.houseNumber - b.houseNumber);
}

export async function getCourses(artists: Artist[]): Promise<Course[]> {
  const allEntries = await getCollection("courses");
  const entries = allEntries.filter((entry) => !entry.data.disabled);
  const artistsMap = new Map(artists.map((artist) => [artist.id, artist]));

  const courses = entries.map((entry) => {
    const artistIds = parseArtistIds(entry.data.artist_ids);

    const courseArtists = artistIds
      .map((id) => artistsMap.get(id))
      .filter((artist): artist is Artist => artist !== undefined);

    const houseNumber =
      courseArtists.length > 0
        ? Math.min(...courseArtists.map((artist) => artist.houseNumber))
        : 0;

    const slug = entry.data.slug;
    let images = getCourseImages(slug);
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
  });

  return courses
    .filter((course) => course.houseNumber > 0)
    .toSorted((a, b) => a.houseNumber - b.houseNumber);
}

export async function getExpositions(): Promise<Exposition[]> {
  const entries = await getCollection("expositions");

  const expositions = entries.map((entry) => {
    const { heroImage, flyerImage } = getExpositionImages(entry.data.slug);

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
  });

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
