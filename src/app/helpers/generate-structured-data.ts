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
    .filter((artist) => artist.name && artist.description)
    .map((artist) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: artist.name,
      jobTitle: artist.description,
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
      ...(artist.website && { url: artist.website }),
      ...(artist.image && {
        image: {
          "@type": "ImageObject",
          url: artist.image,
        },
      }),
    }));

  // Course/Event schemas
  const courseSchemas = courses.map((course) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: `${course.name} gegeven door ${course.artist_name}${
      course.additional_artist_name
        ? ` en ${course.additional_artist_name}`
        : ""
    }`,
    provider: {
      "@type": "Organization",
      name: "De Kersenboomgaard",
    },
    instructor: {
      "@type": "Person",
      name: course.artist_name,
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
  }));

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
