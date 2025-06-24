import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import type { Artist } from "~/types";
import { generateSlug } from "~/utils/generate-slug";
import { getArtistImages } from "./get-artist-images";

export async function getArtists(): Promise<Artist[]> {
  const contentDir = path.join(process.cwd(), "content/artists");
  const files = await glob("*.md", { cwd: contentDir });

  const artists = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data } = matter(fileContent);

      const id = data.id || generateSlug(data.name);
      const { image, flip_image, all_images } = await getArtistImages(id);

      return {
        id,
        name: data.name,
        profession: data.profession,
        link: data.link,
        image,
        flip_image,
        all_images,
        house_number: data.house_number,
      };
    }),
  );

  return artists.toSorted((a, b) => a.house_number - b.house_number);
}
