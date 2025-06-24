import { getArtists } from "./get-artists";
import { getCourses } from "./get-courses";

export interface SEOData {
  artistNames: string[];
  professions: string[];
  courseNames: string[];
  keywords: string[];
  description: string;
  title: string;
}

export async function getSEOData(): Promise<SEOData> {
  const artists = await getArtists();
  const courses = await getCourses();

  // Extract artist names
  const artistNames = artists.map((artist) => artist.name).filter(Boolean);

  // Extract unique professions in Dutch
  const professions = [
    ...new Set(
      artists
        .map((artist) => artist.profession)
        .filter(Boolean)
        .map((profession) => profession.toLowerCase()),
    ),
  ];

  // Extract course names
  const courseNames = courses.map((course) => course.name).filter(Boolean);

  // Generate comprehensive Dutch keywords
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

  // Add artist names with Utrecht
  const artistKeywords = artistNames.map((name) => `${name} Utrecht`);

  // Add profession-based keywords
  const professionKeywords = professions.flatMap((profession) => [
    `${profession} Utrecht`,
    profession,
  ]);

  // Add course-based keywords
  const courseKeywords = courseNames.flatMap((course) => [
    `${course} Utrecht`,
    `cursus ${course}`,
    `workshop ${course}`,
  ]);

  const keywords = [
    ...baseKeywords,
    ...artistNames,
    ...artistKeywords,
    ...professionKeywords,
    ...courseKeywords,
  ];

  // Generate dynamic description without mentioning specific artists to treat everyone equally
  const description = `De Kersenboomgaard Utrecht: kunstenaarscommunity met ${artists.length}+ kunstenaars, makers en creatievelingen. Atelierwoningen, cursussen en workshops in Leidsche Rijn.`;

  // Generate dynamic title
  const title = `De Kersenboomgaard - Kunstenaars & Ateliers Utrecht | ${artists.length}+ Creatievelingen`;

  return {
    artistNames,
    professions,
    courseNames,
    keywords: [...new Set(keywords)], // Remove duplicates
    description,
    title,
  };
}
