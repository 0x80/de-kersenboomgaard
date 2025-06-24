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

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {expositions.map((expo, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-xl font-medium text-gray-900">{expo.title}</h3>
          <p className="text-sm font-medium text-gray-500">
            {formatExpositionDate(expo)}
          </p>
          {expo.opening_time && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Opening:</span>{" "}
              {formatDutchDate(expo.start_date)}
              {", "}
              {parseTimeFormat(String(expo.opening_time))}
              {expo.opening_description && <> – {expo.opening_description}</>}
            </p>
          )}
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Locatie:</span> {expo.location},{" "}
            {expo.address}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Curator:</span> {expo.curator}
          </p>
          {expo.artist_id && artistsMap[expo.artist_id]?.name && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Kunstenaars:</span>{" "}
              <button
                onClick={(e) => handleArtistClick(e, expo.artist_id)}
                className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
              >
                {artistsMap[expo.artist_id]?.name}
              </button>
            </p>
          )}
          {expo.content && (
            <p className="leading-relaxed text-gray-600">{expo.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
