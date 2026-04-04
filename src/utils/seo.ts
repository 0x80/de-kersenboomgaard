import type { Artist, Course } from "./content";

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

export function getSEOData(artists: Artist[], courses: Course[]): SEOData {
  const artistNames = artists.map((artist) => artist.name).filter(Boolean);

  const professions = [
    ...new Set(
      artists
        .map((artist) => artist.profession)
        .filter(Boolean)
        .map((profession) => profession.toLowerCase()),
    ),
  ];

  const courseNames = courses.map((course) => course.name).filter(Boolean);

  const baseKeywords = [
    "De Kersenboomgaard",
    "kunstenaars Utrecht",
    "ateliers Utrecht",
    "kunstcommunity Utrecht",
    "kunstenaarscommunity Utrecht",
    "atelierwoningen Utrecht",
    "Leidsche Rijn kunstenaars",
    "cursussen Utrecht",
    "workshops Utrecht",
    "beeldende kunst Utrecht",
    "creatieve community Utrecht",
    "kunstenaars Leidsche Rijn",
  ];

  const artistKeywords = artistNames.map((name) => `${name} Utrecht`);

  const professionKeywords = professions.flatMap((profession) => [
    `${profession} Utrecht`,
    profession,
  ]);

  const courseKeywords = courseNames.flatMap((course) => [
    `${course} Utrecht`,
    `cursus ${course}`,
    `workshop ${course}`,
  ]);

  const keywords = [
    ...new Set([
      ...baseKeywords,
      ...artistNames,
      ...artistKeywords,
      ...professionKeywords,
      ...courseKeywords,
    ]),
  ];

  const description = `De Kersenboomgaard Utrecht: kunstenaarscommunity met ${artists.length}+ kunstenaars, makers en creatievelingen. Atelierwoningen, cursussen en workshops in Leidsche Rijn.`;

  const title = `De Kersenboomgaard - Kunstenaars & Ateliers Utrecht | ${artists.length}+ Creatievelingen`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
  };
}

export function generateStructuredData(artists: Artist[], courses: Course[]) {
  const artistsMap = new Map(artists.map((artist) => [artist.id, artist]));

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "De Kersenboomgaard",
    alternateName: "Ateliers Kersenboomgaard",
    description:
      "Kunstenaarscommunity in Utrecht met 40+ kunstenaars, makers en creatievelingen in atelierwoningen rond een historische kersenboomgaard.",
    url: "https://dekersenboomgaard.nl",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emmy van Lokhorststraat 2 - 60",
      addressLocality: "Utrecht",
      postalCode: "3544HM",
      addressCountry: "NL",
    },
    areaServed: { "@type": "City", name: "Utrecht" },
    foundingLocation: { "@type": "Place", name: "Leidsche Rijn, Utrecht" },
    sameAs: ["https://www.facebook.com/atelierskersenboomgaard/"],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "De Kersenboomgaard",
    description:
      "Kunstenaarscommunity en ateliercomplex in Utrecht met cursussen, workshops en tentoonstellingen.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emmy van Lokhorststraat 2 - 60",
      addressLocality: "Utrecht",
      postalCode: "3544HM",
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "52.1015",
      longitude: "5.0570",
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "\u20AC\u20AC",
    servesCuisine: "Art & Culture",
  };

  const persons = artists
    .filter((artist) => artist.name && artist.profession)
    .map((artist) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: artist.name,
      jobTitle: artist.profession,
      worksFor: { "@type": "Organization", name: "De Kersenboomgaard" },
      address: {
        "@type": "PostalAddress",
        streetAddress: `Emmy van Lokhorststraat ${artist.houseNumber}`,
        addressLocality: "Utrecht",
        postalCode: "3544HM",
        addressCountry: "NL",
      },
      ...(artist.link && { url: artist.link }),
      ...(artist.image && {
        image: { "@type": "ImageObject", url: artist.image },
      }),
    }));

  const courseSchemas = courses.map((course) => {
    const courseArtists = course.artistIds
      .map((id) => artistsMap.get(id))
      .filter((artist): artist is Artist => artist !== undefined);

    const artistNames = courseArtists.map((artist) => artist.name);
    const instructorName = artistNames[0] || "Unknown";
    const artistNamesText =
      artistNames.length > 1
        ? artistNames.slice(0, -1).join(", ") + " en " + artistNames[artistNames.length - 1]
        : artistNames[0] || "Unknown";

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.name,
      description: `${course.name} gegeven door ${artistNamesText}`,
      provider: { "@type": "Organization", name: "De Kersenboomgaard" },
      instructor: { "@type": "Person", name: instructorName },
      location: {
        "@type": "Place",
        name: "De Kersenboomgaard",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Emmy van Lokhorststraat 2 - 60",
          addressLocality: "Utrecht",
          postalCode: "3544HM",
          addressCountry: "NL",
        },
      },
      ...(course.link && { url: course.link }),
      courseMode: "In-person",
      educationalLevel: "All levels",
    };
  });

  return { organization, localBusiness, persons, courses: courseSchemas };
}
