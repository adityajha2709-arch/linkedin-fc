const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

export function parseDateString(dateStr: string): Date | null {
  const trimmed = dateStr.trim().toLowerCase();

  if (trimmed === "present" || trimmed === "current") {
    return new Date();
  }

  // Try "Month Year" format (e.g., "Jan 2020", "January 2020")
  const monthYearMatch = trimmed.match(/^([a-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const month = MONTH_MAP[monthYearMatch[1]];
    const year = parseInt(monthYearMatch[2], 10);
    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }

  // Try year-only format (e.g., "2020")
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1);
  }

  return null;
}

export function calculateDuration(startDate: string, endDate: string): string {
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  if (!start || !end) return "";

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0 && remainingMonths === 0) return "< 1 mo";
  if (years === 0) return `${remainingMonths} mos`;
  if (remainingMonths === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mos`;
}

export function formatYearRange(startYear?: string, endYear?: string): string {
  if (!startYear && !endYear) return "";
  if (startYear && !endYear) return startYear;
  if (!startYear && endYear) return endYear;
  if (startYear === endYear) return startYear!;
  return `${startYear} – ${endYear}`;
}
