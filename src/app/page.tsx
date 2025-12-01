import { SectionHeader } from "../components/section-header";
import { AgendaList } from "./components/agenda-list";
import { ArtistCard } from "./components/artist-card";
import { CourseList } from "./components/course-list";
import { ExpositionList } from "./components/exposition-list";
import { generateStructuredData } from "./helpers/generate-structured-data";
import { getAgendaItems } from "./helpers/get-agenda-items";
import { getArtists } from "./helpers/get-artists";
import { getCourses } from "./helpers/get-courses";
import { getExpositions } from "./helpers/get-expositions";

/** Ensure fresh random offsets on each request */
export const dynamic = "force-dynamic";

export default async function Component() {
  const expositions = await getExpositions();
  const artists = await getArtists();
  const courses = await getCourses();
  const agendaItems = await getAgendaItems();

  /**
   * Generate random image offsets server-side for stable hydration.
   * Math.random() is safe here as server components only render once per request.
   */
  const artistImageOffsets = artists.map((artist) => {
    const imageCount =
      artist.all_images.length > 0
        ? artist.all_images.length
        : [artist.image, artist.flip_image].filter(Boolean).length;
    // eslint-disable-next-line react-hooks/purity
    return imageCount > 1 ? Math.floor(Math.random() * imageCount) : 0;
  });

  /** Generate structured data for SEO */
  const structuredData = generateStructuredData(artists, courses);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.localBusiness),
        }}
      />
      {structuredData.persons.map((person, index) => (
        <script
          key={`person-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person),
          }}
        />
      ))}
      {structuredData.courses.map((course, index) => (
        <script
          key={`course-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(course),
          }}
        />
      ))}

      <div
        className="min-h-screen bg-white"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-6 py-12 pt-24">
          <div className="mb-8">
            <SectionHeader id="artists">
              Kunstenaars, Makers & Creatievelingen
            </SectionHeader>
          </div>

          {/* Artists Grid */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {artists.map((artist, index) => (
              <ArtistCard
                key={index}
                artist={artist}
                initialImageOffset={artistImageOffsets[index]}
              />
            ))}
          </div>

          {/* Expositions Section */}
          <div className="mt-16 mb-8">
            <SectionHeader id="expositions">
              Exposities & Voorstellingen
            </SectionHeader>
          </div>
          {expositions.length > 0 ? (
            <ExpositionList expositions={expositions} artists={artists} />
          ) : (
            <div className="mx-auto max-w-4xl">
              <p className="text-center text-gray-600">
                Momenteel zijn er geen exposities of voorstellingen gepland.
              </p>
            </div>
          )}

          {/* Courses Section */}
          {courses.length > 0 && (
            <>
              <div className="mt-16 mb-8">
                <SectionHeader id="courses">
                  Cursussen & Workshops
                </SectionHeader>
              </div>

              <CourseList courses={courses} artists={artists} />
            </>
          )}

          {/* Agenda Section */}
          {agendaItems.length > 0 && (
            <>
              <div className="mt-16 mb-8">
                <SectionHeader id="agenda">Agenda</SectionHeader>
              </div>

              <AgendaList agendaItems={agendaItems} />
            </>
          )}

          {/* Over ons Section */}
          <div className="mt-16 mb-8">
            <SectionHeader id="over-ons">Over Ons</SectionHeader>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 leading-relaxed text-gray-700">
              <p>
                Ateliers Kersenboomgaard is gelegen rond een oude
                kersenboomgaard in het Utrechtse stadsdeel Leidsche Rijn. Hier
                wonen en werken meer dan veertig kunstenaars verdeeld over
                dertig atelierwoningen; een uniek project voor professionele
                creatief ondernemers. Het palet van aanwezige disciplines is
                even kleurrijk als uitgebreid. Schrijvers en schilders, theater
                en dans, multimedia en gemengde technieken. Van ambachtelijk
                handwerk tot industrieel design.
              </p>
              <p>
                De atelierwoningen zijn verdeeld over 3 identieke gebouwen,
                gelegen rond een oude hoogstam kersenboomgaard, eens onderdeel
                van het groene buitengebied ten westen van Utrecht en straks
                gelegen in het hart van Leidsche Rijn, vlak bij station
                Terwijde.
              </p>
              <p>
                Dit project is een initiatief van{" "}
                <a
                  href="https://deplaatsmaker.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
                >
                  De Plaatsmaker
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
          <div className="mt-16 mb-8">
            <SectionHeader id="contact">Contact</SectionHeader>
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
          <div className="mt-16 mb-8 text-center">
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
    </>
  );
}
