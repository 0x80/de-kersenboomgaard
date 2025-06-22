"use client";

import { got } from "get-or-throw";
import Link from "next/link";

export interface Course {
  artist_id: string;
  name: string;
  link: string;
  start_month?: number;
  end_month?: number;
  content: string;
  artist_name: string;
  house_number: number;
  additional_artist_id?: string;
  additional_artist_name?: string;
}

const DUTCH_MONTHS = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];

function formatMonthRange(startMonth?: number, endMonth?: number): string {
  if (!startMonth && !endMonth) return "";
  if (startMonth && !endMonth) return got(DUTCH_MONTHS, startMonth - 1);
  if (!startMonth && endMonth) return got(DUTCH_MONTHS, endMonth - 1);
  if (startMonth === endMonth) return got(DUTCH_MONTHS, startMonth! - 1);
  return `${got(DUTCH_MONTHS, startMonth! - 1)} - ${got(DUTCH_MONTHS, endMonth! - 1)}`;
}

export function CourseCard({ course }: { course: Course }) {
  const monthRange = formatMonthRange(course.start_month, course.end_month);

  const handleArtistClick = (e: React.MouseEvent, artistId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const element = document.getElementById(`artist-${artistId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xl font-medium text-gray-900">{course.name}</h3>

        {/* Artist names */}
        <p className="text-sm text-gray-600">
          door{" "}
          <button
            onClick={(e) => handleArtistClick(e, course.artist_id)}
            className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
          >
            {course.artist_name}
          </button>
          {course.additional_artist_name && course.additional_artist_id && (
            <>
              {" & "}
              <button
                onClick={(e) =>
                  handleArtistClick(e, course.additional_artist_id!)
                }
                className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
              >
                {course.additional_artist_name}
              </button>
            </>
          )}
        </p>

        {monthRange && (
          <p className="text-sm font-medium text-gray-500">{monthRange}</p>
        )}

        {course.content && (
          <p className="leading-relaxed text-gray-600">{course.content}</p>
        )}

        <Link
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-100 px-1 py-0.5 text-sm text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
        >
          Meer info →
        </Link>
      </div>
    </div>
  );
}
