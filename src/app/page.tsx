import { glob } from "glob";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

import { AgendaList, type AgendaItem } from "./components/agenda-list";
import { ArtistCard } from "./components/artist-card";
import { CourseList, type Course } from "./components/course-list";

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
): Promise<{ image: string; flip_image: string; all_images: string[] }> {
  const assetsDir = path.join(process.cwd(), "public/assets", artistId);

  try {
    const files = await fs.readdir(assetsDir);
    const jpgFiles = files
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg") ||
          file.toLowerCase().endsWith(".png"),
      )
      .sort();

    const all_images = jpgFiles.map((file) => `/assets/${artistId}/${file}`);
    const image = jpgFiles[0] ? `/assets/${artistId}/${jpgFiles[0]}` : "";
    const flip_image = jpgFiles[1]
      ? `/assets/${artistId}/${jpgFiles[1]}`
      : image;

    return { image, flip_image, all_images };
  } catch {
    // If folder doesn't exist or no images found, return empty strings
    return { image: "", flip_image: "", all_images: [] };
  }
}

export interface Artist {
  id: string;
  name: string;
  description: string;
  website: string;
  image: string;
  flip_image: string;
  all_images: string[];
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
      const { image, flip_image, all_images } = await getArtistImages(id);

      return {
        id,
        name: data.name,
        description: data.profession,
        website: data.link,
        image,
        flip_image,
        all_images,
        house_number: data.house_number,
      };
    }),
  );

  return artists.toSorted((a, b) => a.house_number - b.house_number);
}

async function getCourses(): Promise<Course[]> {
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

async function getAgendaItems(): Promise<AgendaItem[]> {
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

export default async function Component() {
  const artists = await getArtists();
  const courses = await getCourses();
  const agendaItems = await getAgendaItems();

  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12 pt-24">
        <div className="mb-16 text-center">
          <h2 id="artists" className="mb-4 text-3xl font-light text-gray-900">
            Kunstenaars, Makers & Creatievelingen
          </h2>
        </div>

        {/* Artists Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {artists.map((artist, index) => (
            <ArtistCard key={index} artist={artist} />
          ))}
        </div>

        {/* Courses Section */}
        {courses.length > 0 && (
          <>
            <div className="mt-24 mb-16 text-center">
              <h2
                id="courses"
                className="mb-4 text-3xl font-light text-gray-900"
              >
                Cursussen & Workshops
              </h2>
            </div>

            <CourseList courses={courses} />
          </>
        )}

        {/* Agenda Section */}
        {agendaItems.length > 0 && (
          <>
            <div className="mt-24 mb-16 text-center">
              <h2
                id="agenda"
                className="mb-4 text-3xl font-light text-gray-900"
              >
                Agenda
              </h2>
            </div>

            <AgendaList agendaItems={agendaItems} />
          </>
        )}

        {/* Over ons Section */}
        <div className="mt-24 mb-16 text-center">
          <h2 id="over-ons" className="mb-4 text-3xl font-light text-gray-900">
            Over Ons
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-6 leading-relaxed text-gray-700">
            <p>
              Ateliers Kersenboomgaard is gelegen rond een oude kersenboomgaard
              in het Utrechtse stadsdeel Leidsche Rijn. Hier wonen en werken
              meer dan veertig kunstenaars verdeeld over dertig atelierwoningen;
              een uniek project voor professionele creatief ondernemers. Het
              palet van aanwezige disciplines is even kleurrijk als uitgebreid.
              Schrijvers en schilders, theater en dans, multimedia en gemengde
              technieken. Van ambachtelijk handwerk tot industrieel design.
            </p>
            <p>
              De atelierwoningen zijn verdeeld over 3 identieke gebouwen,
              gelegen rond een oude hoogstam kersenboomgaard, eens onderdeel van
              het groene buitengebied ten westen van Utrecht en straks gelegen
              in het hart van Leidsche Rijn, vlak bij station Terwijde.
            </p>
            <p>
              Dit project is een initiatief van{" "}
              <a
                href="https://www.plaatsmaker.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
              >
                Plaatsmaker
              </a>
              ,{" "}
              <a
                href="https://www.portaal.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
              >
                Portaal
              </a>{" "}
              en{" "}
              <a
                href="https://www.utrecht.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
              >
                Gemeente Utrecht
              </a>
              .
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-24 mb-16 text-center">
          <h2 id="contact" className="mb-4 text-3xl font-light text-gray-900">
            Contact
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-2 text-center text-gray-700">
            <p className="font-medium text-gray-900">
              Ateliers Kersenboomgaard
            </p>
            <p>Emmy van Lokhorststraat 2 - 60</p>
            <p>3544HM Utrecht</p>
            <p>Nederland</p>
          </div>
        </div>

        {/* Facebook Section */}
        <div className="mt-24 mb-16 text-center">
          <div className="mx-auto max-w-4xl">
            <a
              href="https://www.facebook.com/atelierskersenboomgaard/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 text-gray-700 transition-colors hover:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Volg ons op Facebook</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
