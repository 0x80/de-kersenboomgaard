import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import type { AgendaItem } from "~/types";

export async function getAgendaItems(): Promise<AgendaItem[]> {
  const contentDir = path.join(process.cwd(), "content/agenda");

  try {
    const files = await glob("*.md", { cwd: contentDir });

    const agendaItems = await Promise.all(
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
          event_link: data.event_link,
          content: content.trim(),
        };
      }),
    );

    // Sort by start_date descending (upcoming events first)
    return agendaItems.toSorted(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
    );
  } catch {
    // If agenda folder doesn't exist, return empty array
    return [];
  }
}
