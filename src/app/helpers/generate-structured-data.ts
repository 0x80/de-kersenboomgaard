import type { Artist, Course } from "~/types";

export interface StructuredData {
  organization: object;
  localBusiness: object;
  persons: object[];
  courses: object[];
}

export function generateStructuredData(
  artists: Artist[],
  courses: Course[],
): StructuredData {
  // Create a map for quick artist lookup
  const artistsMap = new Map(artists.map((artist) => [artist.id, artist]));
  // Organization schema for De Kersenboomgaard
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "De Kersenboomgaard",
    alternateName: "Ateliers Kersenboomgaard",
    description:
      "Kunstenaarscommunity in Utrecht met 40+ kunstenaars, makers en creatievelingen in atelierwoningen rond een historische kersenboomgaard.",
    url: typeof window !== "undefined" ? window.location.origin : "",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emmy van Lokhorststraat 2 - 60",
      addressLocality: "Utrecht",
      postalCode: "3544HM",
      addressCountry: "NL",
    },
    areaServed: {
      "@type": "City",
      name: "Utrecht",
    },
    foundingLocation: {
      "@type": "Place",
      name: "Leidsche Rijn, Utrecht",
    },
    sameAs: ["https://www.facebook.com/atelierskersenboomgaard/"],
  };

  // LocalBusiness schema
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
    priceRange: "€€",
    servesCuisine: "Art & Culture",
  };

  // Person schemas for artists
  const persons = artists
    .filter((artist) => artist.name && artist.profession)
    .map((artist) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: artist.name,
      jobTitle: artist.profession,
      worksFor: {
        "@type": "Organization",
        name: "De Kersenboomgaard",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: `Emmy van Lokhorststraat ${artist.house_number}`,
        addressLocality: "Utrecht",
        postalCode: "3544HM",
        addressCountry: "NL",
      },
      ...(artist.link && { url: artist.link }),
      ...(artist.image && {
        image: {
          "@type": "ImageObject",
          url: artist.image,
        },
      }),
    }));

  // Course/Event schemas
  const courseSchemas = courses.map((course) => {
    // Get artist IDs as array
    const artistIdsArray = Array.isArray(course.artist_ids)
      ? course.artist_ids
      : typeof course.artist_ids === "string" && course.artist_ids.includes(",")
        ? course.artist_ids.split(",").map((id) => id.trim())
        : [course.artist_ids].filter((id) => id);

    // Get artist names
    const courseArtists = artistIdsArray
      .map((id) => artistsMap.get(id))
      .filter((artist) => artist !== undefined);

    const artistNames = courseArtists.map((artist) => artist.name);
    const instructorName = artistNames[0] || "Unknown";
    const artistNamesText =
      artistNames.length > 1
        ? artistNames.slice(0, -1).join(", ") +
          " en " +
          artistNames[artistNames.length - 1]
        : artistNames[0] || "Unknown";

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.name,
      description: `${course.name} gegeven door ${artistNamesText}`,
      provider: {
        "@type": "Organization",
        name: "De Kersenboomgaard",
      },
      instructor: {
        "@type": "Person",
        name: instructorName,
      },
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

  return {
    organization,
    localBusiness,
    persons,
    courses: courseSchemas,
  };
}

export function generateStructuredDataScript(structuredData: StructuredData) {
  const allSchemas = [
    structuredData.organization,
    structuredData.localBusiness,
    ...structuredData.persons,
    ...structuredData.courses,
  ];

  return allSchemas.map((schema) => JSON.stringify(schema, null, 2)).join("\n");
}
