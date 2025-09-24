import type { PeriodKey } from "../types";

export function parsePeriodKey(p: string): { year: number; month: number } {
  const [y, m] = p.split("-").map((x) => Number(x));
  return { year: y, month: m };
}

export function comparePeriod(a: string, b: string): number {
  const A = parsePeriodKey(a); const B = parsePeriodKey(b);
  if (A.year !== B.year) return A.year - B.year;
  return A.month - B.month;
}

export function academicYearOf(p: PeriodKey, ayStartMonth = 9): string {
  const { year, month } = parsePeriodKey(p);
  if (month >= ayStartMonth) return `${year}-${year + 1}`;
  return `${year - 1}-${year}`;
}

export function isInAcademicYear(p: PeriodKey, ay: string, ayStartMonth = 9): boolean {
  const [y1, y2] = ay.split("-").map((x) => Number(x));
  const { year, month } = parsePeriodKey(p);
  // AY runs from ayStartMonth of y1 to ayStartMonth-1 of y2
  if (month >= ayStartMonth) {
    return year === y1;
  } else {
    return year === y2;
  }
}
