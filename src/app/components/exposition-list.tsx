"use client";

import { got } from "get-or-throw";
import type { Artist, Exposition } from "~/types";

const DUTCH_MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function formatDutchDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = DUTCH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function parseTimeFormat(timeStr: string): string {
  if (!timeStr) return "";
  const match = timeStr.match(/h(\d{1,2})m(\d{2})/);
  if (match) {
    const hours = got(match, 1).padStart(2, "0");
    const minutes = got(match, 2);
    return `${hours}:${minutes}`;
  }
  return timeStr;
}

function formatExpositionDate(expo: Exposition): string {
  const startDate = new Date(expo.start_date);
  const endDate = expo.end_date ? new Date(expo.end_date) : null;

  let dateStr = formatDutchDate(expo.start_date);

  if (endDate && endDate.getTime() !== startDate.getTime()) {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = DUTCH_MONTHS[startDate.getMonth()];
    const endMonth = DUTCH_MONTHS[endDate.getMonth()];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    if (startYear === endYear && startMonth === endMonth) {
      dateStr = `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
      dateStr = `${formatDutchDate(expo.start_date)} - ${formatDutchDate(expo.end_date!)}`;
    }
  }

  if (expo.start_time) {
    dateStr += ` • ${parseTimeFormat(String(expo.start_time))}`;
    if (expo.end_time && expo.end_time !== expo.start_time) {
      dateStr += ` - ${parseTimeFormat(String(expo.end_time))}`;
    }
  }

  return dateStr;
}

export function ExpositionList({
  expositions,
  artists,
}: {
  expositions: Exposition[];
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
      {expositions.map((expo, index) => {
        const artistIds = getArtistIds(expo.artist_ids);
        const linkedArtists = artistIds
          .map((id) => artistsMap[id])
          .filter((artist): artist is Artist => artist?.name !== undefined);

        return (
          <div key={index} className="space-y-3">
            <h3 className="text-xl font-medium text-gray-900">{expo.title}</h3>
            {linkedArtists.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Kunstenaars:</span>{" "}
                {linkedArtists.map((artist, artistIndex) => (
                  <span key={artist.id}>
                    <button
                      onClick={(e) => handleArtistClick(e, artist.id)}
                      className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
                    >
                      {artist.name}
                    </button>
                    {artistIndex < linkedArtists.length - 1 && ", "}
                  </span>
                ))}
              </p>
            )}
            <p className="text-sm font-medium text-gray-500">
              {formatExpositionDate(expo)}
            </p>
            {expo.opening_event_time && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Opening:</span>{" "}
                {formatDutchDate(expo.start_date)}
                {", "}
                {parseTimeFormat(String(expo.opening_event_time))}
                {expo.opening_event_description && (
                  <> – {expo.opening_event_description}</>
                )}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Locatie:</span> {expo.location},{" "}
              {expo.address}
            </p>

            {expo.content && (
              <p className="leading-relaxed text-gray-600">{expo.content}</p>
            )}
            {expo.link && (
              <p className="text-sm">
                <a
                  href={expo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 px-2 py-1 text-gray-900 transition-all hover:text-black hover:shadow-[0_3px_0_0_#374151]"
                >
                  Meer info
                </a>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
