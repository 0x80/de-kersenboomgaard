"use client";

import { got } from "get-or-throw";

export interface AgendaItem {
  title: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  event_link: string;
  content: string;
}

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
  // Convert h12m00 format to 12:00
  const match = timeStr.match(/h(\d{1,2})m(\d{2})/);
  if (match) {
    const hours = got(match, 1).padStart(2, "0");
    const minutes = got(match, 2);
    return `${hours}:${minutes}`;
  }
  // If it's already in HH:MM format or other format, return as is
  return timeStr;
}

function formatEventDate(item: AgendaItem): string {
  const startDate = new Date(item.start_date);
  const endDate = item.end_date ? new Date(item.end_date) : null;

  let dateStr = formatDutchDate(item.start_date);

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
      dateStr = `${formatDutchDate(item.start_date)} - ${formatDutchDate(item.end_date!)}`;
    }
  }

  if (item.start_time) {
    const startTime = parseTimeFormat(String(item.start_time));
    dateStr += ` • ${startTime}`;
    if (item.end_time && item.end_time !== item.start_time) {
      const endTime = parseTimeFormat(String(item.end_time));
      dateStr += ` - ${endTime}`;
    }
  }

  return dateStr;
}

export function AgendaList({ agendaItems }: { agendaItems: AgendaItem[] }) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {agendaItems.map((item, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-xl font-medium text-gray-900">{item.title}</h3>
          <p className="text-sm font-medium text-gray-500">
            {formatEventDate(item)}
          </p>
          {item.content && (
            <p className="leading-relaxed text-gray-600">{item.content}</p>
          )}
          <a
            href={item.event_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-100 px-1 py-0.5 text-sm text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
          >
            Meer info →
          </a>
        </div>
      ))}
    </div>
  );
}
