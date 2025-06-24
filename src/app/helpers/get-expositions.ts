import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import type { Exposition } from "~/types";

export async function getExpositions(): Promise<Exposition[]> {
  const contentDir = path.join(process.cwd(), "content/expositions");

  try {
    const files = await glob("*.md", { cwd: contentDir });

    const expositions = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          title: data.title,
          start_date: data.start_date,
          start_time: data.start_time,
          end_date: data.end_date,
          end_time: data.end_time,
          location: data.location,
          address: data.address,
          curator: data.curator,
          opening_time: data.opening_time,
          opening_description: data.opening_description,
          artist_id: data.artist_id,
          content: content.trim(),
        };
      }),
    );

    // Sort by start_date descending (upcoming first)
    return expositions.toSorted(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
    );
  } catch {
    return [];
  }
}
