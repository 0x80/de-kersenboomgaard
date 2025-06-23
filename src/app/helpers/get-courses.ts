import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import type { Course } from "~/types";
import { getArtists } from "./get-artists";

export async function getCourses(): Promise<Course[]> {
  const contentDir = path.join(process.cwd(), "content/courses");
  const files = await glob("*.md", { cwd: contentDir });

  // Get all artists to match with courses
  const artists = await getArtists();
  const artistsMap = new Map(artists.map((artist) => [artist.id, artist]));

  const courses = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const artist = artistsMap.get(data.artist_id);
      const additionalArtist = data.additional_artist_id
        ? artistsMap.get(data.additional_artist_id)
        : undefined;

      return {
        artist_id: data.artist_id,
        name: data.name,
        link: data.link,
        start_month: data.start_month,
        end_month: data.end_month,
        content: content.trim(),
        artist_name: artist?.name || "",
        house_number: artist?.house_number || 0,
        additional_artist_id: data.additional_artist_id,
        additional_artist_name: additionalArtist?.name,
      };
    }),
  );

  return courses
    .filter((course) => course.artist_name) // Only include courses with valid artists
    .toSorted((a, b) => a.house_number - b.house_number);
}
