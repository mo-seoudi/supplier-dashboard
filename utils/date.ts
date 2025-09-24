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
  return month >= ayStartMonth ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

export function isInAcademicYear(p: PeriodKey, ay: string, ayStartMonth = 9): boolean {
  const [y1, y2] = ay.split("-").map((x) => Number(x));
  const { year, month } = parsePeriodKey(p);
  return month >= ayStartMonth ? year === y1 : year === y2;
}
