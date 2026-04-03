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

export function formatDutchDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = DUTCH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function parseTimeFormat(timeStr: string): string {
  if (!timeStr) return "";
  const match = timeStr.match(/h(\d{1,2})m(\d{2})/);
  if (match) {
    const hours = match[1]!.padStart(2, "0");
    const minutes = match[2]!;
    return `${hours}:${minutes}`;
  }
  return timeStr;
}

export function formatDateRange(
  startDate: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  let dateStr = formatDutchDate(startDate);

  if (end && end.getTime() !== start.getTime()) {
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = DUTCH_MONTHS[start.getMonth()];
    const endMonth = DUTCH_MONTHS[end.getMonth()];
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    if (startYear === endYear && startMonth === endMonth) {
      dateStr = `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
      dateStr = `${formatDutchDate(startDate)} - ${formatDutchDate(endDate!)}`;
    }
  }

  if (startTime) {
    const parsedStart = parseTimeFormat(String(startTime));
    dateStr += ` \u2022 ${parsedStart}`;
    if (endTime && endTime !== startTime) {
      const parsedEnd = parseTimeFormat(String(endTime));
      dateStr += ` - ${parsedEnd}`;
    }
  }

  return dateStr;
}
