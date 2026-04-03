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
  artistIds: string[];
  name: string;
  link: string;
  startMonth?: number;
  endMonth?: number;
  content: string;
  houseNumber: number;
}

export interface AgendaItem {
  title: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  eventLink: string;
  content: string;
}

export interface Exposition {
  title: string;
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
}

async function getArtistImages(
  artistId: string,
): Promise<{ image: string; flipImage: string; allImages: string[] }> {
  const assetsDir = path.join(process.cwd(), "public/assets/artists", artistId);

  try {
    const files = await fs.readdir(assetsDir);
    const imageFiles = files
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg") ||
          file.toLowerCase().endsWith(".png"),
      )
      .sort();

    const allImages = imageFiles.map((file) => `/assets/artists/${artistId}/${file}`);
    const image = imageFiles[0] ? `/assets/artists/${artistId}/${imageFiles[0]}` : "";
    const flipImage = imageFiles[1] ? `/assets/artists/${artistId}/${imageFiles[1]}` : image;

    return { image, flipImage, allImages };
  } catch {
    return { image: "", flipImage: "", allImages: [] };
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

export async function getCourses(): Promise<Course[]> {
  const entries = await getCollection("courses");
  const artists = await getArtists();
  const artistsMap = new Map(artists.map((artist) => [artist.id, artist]));

  const courses = entries.map((entry) => {
    const artistIds = parseArtistIds(entry.data.artist_ids);

    const courseArtists = artistIds
      .map((id) => artistsMap.get(id))
      .filter((artist): artist is Artist => artist !== undefined);

    const houseNumber =
      courseArtists.length > 0 ? Math.min(...courseArtists.map((artist) => artist.houseNumber)) : 0;

    return {
      artistIds,
      name: entry.data.name,
      link: entry.data.link,
      startMonth: entry.data.start_month,
      endMonth: entry.data.end_month,
      content: entry.body?.trim() ?? "",
      houseNumber,
    };
  });

  return courses
    .filter((course) => course.houseNumber > 0)
    .toSorted((a, b) => a.houseNumber - b.houseNumber);
}

export async function getAgendaItems(): Promise<AgendaItem[]> {
  const entries = await getCollection("agenda");

  const items = entries.map((entry) => ({
    title: entry.data.title,
    startDate: entry.data.start_date,
    startTime: entry.data.start_time,
    endDate: entry.data.end_date,
    endTime: entry.data.end_time,
    eventLink: entry.data.event_link,
    content: entry.body?.trim() ?? "",
  }));

  return items.toSorted(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

export async function getExpositions(): Promise<Exposition[]> {
  const entries = await getCollection("expositions");

  const items = entries.map((entry) => ({
    title: entry.data.title,
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
  }));

  return items.toSorted(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}
