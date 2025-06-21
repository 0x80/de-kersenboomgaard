import { glob } from "glob";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";

interface Artist {
  name: string;
  description: string;
  website: string;
  image: string;
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
      };
    }),
  );

  return artists;
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
          <p className="text-gray-500 italic">
            Deze lijst is momenteel nog onvolledig
          </p>
        </div>

        {/* Artists Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {artists.map((artist, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                  {artist.name}
                </h3>
                {artist.description && (
                  <p className="mb-2 text-sm leading-relaxed text-gray-600">
                    {artist.description}
                  </p>
                )}
                {artist.website && (
                  <Link
                    href={`https://${artist.website}`}
                    className="text-xs text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {artist.website}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
