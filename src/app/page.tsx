import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

import { ArtistCard } from "./artist-card";

export interface Artist {
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

      return {
        name: data.name,
        description: data.profession,
        website: data.link,
        image: data.image,
        flip_image: data.flip_image,
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
