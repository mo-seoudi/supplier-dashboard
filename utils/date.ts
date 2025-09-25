import type { PeriodKey } from "../types";
export function parsePeriodKey(p: string): { year: number; month: number } { const [y, m] = p.split("-").map(Number); return { year: y, month: m }; }
export function comparePeriod(a: string, b: string): number { const A = parsePeriodKey(a); const B = parsePeriodKey(b); if (A.year !== B.year) return A.year - B.year; return A.month - B.month; }
export function monthsForAY(ay: string, ayStart = 9): string[] {
  const [y1, y2] = ay.split("-").map(Number);
  const res: string[] = [];
  for (let m = ayStart; m <= 12; m++) res.push(`${y1}-${String(m).padStart(2, "0")}`);
  for (let m = 1; m < ayStart; m++) res.push(`${y2}-${String(m).padStart(2, "0")}`);
  return res;
}
