"use client";

import type { Artist, Course } from "~/types";

export function CourseList({
  courses,
  artists,
}: {
  courses: Course[];
  artists: Artist[];
}) {
  const artistsMap = Object.fromEntries(artists.map((a) => [a.id, a]));

  const handleArtistClick = (e: React.MouseEvent, artistId: string) => {
    e.preventDefault();
    const element = document.getElementById(`artist-${artistId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper function to normalize artist_ids to array
  const getArtistIds = (artistIds: string | string[]): string[] => {
    if (Array.isArray(artistIds)) {
      return artistIds;
    }
    if (typeof artistIds === "string") {
      if (artistIds.includes(",")) {
        return artistIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
      }
      return artistIds ? [artistIds] : [];
    }
    return [];
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {courses.map((course, index) => {
        const artistIds = getArtistIds(course.artist_ids);
        const linkedArtists = artistIds
          .map((id) => artistsMap[id])
          .filter((artist): artist is Artist => artist?.name !== undefined);

        return (
          <div key={index} className="space-y-3">
            <h3 className="text-xl font-medium text-gray-900">{course.name}</h3>
            {linkedArtists.length > 0 && (
              <p className="text-sm text-gray-600">
                {linkedArtists.length === 1 ? "docent" : "docenten"}{" "}
                {linkedArtists.map((artist, artistIndex) => (
                  <span key={artist.id}>
                    <button
                      onClick={(e) => handleArtistClick(e, artist.id)}
                      className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
                    >
                      {artist.name}
                    </button>
                    {artistIndex < linkedArtists.length - 1 &&
                      (artistIndex === linkedArtists.length - 2 ? " & " : ", ")}
                  </span>
                ))}
              </p>
            )}
            {course.content && (
              <p className="leading-relaxed text-gray-600">{course.content}</p>
            )}
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-100 px-1 py-0.5 text-sm text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
            >
              Meer info →
            </a>
          </div>
        );
      })}
    </div>
  );
}
