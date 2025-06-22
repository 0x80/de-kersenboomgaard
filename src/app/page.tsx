import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

import { ArtistCard } from "./artist-card";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

async function getArtistImages(
  artistId: string,
): Promise<{ image: string; flip_image: string }> {
  const assetsDir = path.join(process.cwd(), "public/assets", artistId);

  try {
    const files = await fs.readdir(assetsDir);
    const jpgFiles = files
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg"),
      )
      .sort();

    const image = jpgFiles[0] ? `/assets/${artistId}/${jpgFiles[0]}` : "";
    const flip_image = jpgFiles[1]
      ? `/assets/${artistId}/${jpgFiles[1]}`
      : image;

    return { image, flip_image };
  } catch (error) {
    // If folder doesn't exist or no images found, return empty strings
    return { image: "", flip_image: "" };
  }
}

export interface Artist {
  id: string;
  name: string;
  description: string;
  website: string;
  image: string;
  flip_image: string;
  house_number: number;
}

async function getArtists(): Promise<Artist[]> {
  const contentDir = path.join(process.cwd(), "content/artists");
  const files = await glob("*.md", { cwd: contentDir });

  const artists = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data } = matter(fileContent);

      const id = data.id || generateSlug(data.name);
      const { image, flip_image } = await getArtistImages(id);

      return {
        id,
        name: data.name,
        description: data.profession,
        website: data.link,
        image,
        flip_image,
        house_number: data.house_number,
      };
    }),
  );

  return artists.toSorted((a, b) => a.house_number - b.house_number);
}

export default async function Component() {
  const artists = await getArtists();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-gray-900">
              Ateliers Kersenboomgaard
            </h1>
            <nav className="text-sm tracking-wide text-gray-600 uppercase">
              KUNSTENAARS
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-gray-900">
            Kunstenaars
          </h2>
        </div>

        {/* Artists Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {artists.map((artist, index) => (
            <ArtistCard key={index} artist={artist} />
          ))}
        </div>
      </main>
    </div>
  );
}
