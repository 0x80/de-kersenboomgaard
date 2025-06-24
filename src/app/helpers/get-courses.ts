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

      // Handle flexible artist_ids format - support both old and new formats
      let artistIds: string | string[];

      if (data.artist_ids) {
        // New format
        artistIds = data.artist_ids;
      } else {
        // Backward compatibility: convert old format to new
        const ids = [data.artist_id];
        if (data.additional_artist_id) {
          ids.push(data.additional_artist_id);
        }
        artistIds = ids.filter((id) => id); // Remove any undefined values
      }

      // If it's a string with commas, split it into an array
      if (typeof artistIds === "string" && artistIds.includes(",")) {
        artistIds = artistIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
      }

      // Normalize to array for processing
      const artistIdsArray = Array.isArray(artistIds)
        ? artistIds
        : [artistIds].filter((id) => id);

      // Get the first artist's house number for sorting (use lowest if multiple)
      const courseArtists = artistIdsArray
        .map((id) => artistsMap.get(id))
        .filter(
          (artist): artist is NonNullable<typeof artist> =>
            artist !== undefined,
        );

      const houseNumber =
        courseArtists.length > 0
          ? Math.min(...courseArtists.map((artist) => artist.house_number))
          : 0;

      return {
        artist_ids: artistIds,
        name: data.name,
        link: data.link,
        start_month: data.start_month,
        end_month: data.end_month,
        content: content.trim(),
        house_number: houseNumber,
      };
    }),
  );

  return courses
    .filter((course) => course.house_number > 0) // Only include courses with valid artists
    .toSorted((a, b) => a.house_number - b.house_number);
}
