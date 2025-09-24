export const variance = (actual: number, forecast: number) => (actual ?? 0) - (forecast ?? 0);

export const percentDiff = (actual: number, forecast: number) => {
  if (!isFinite(forecast) || forecast === 0) return null;
  return (actual - forecast) / forecast;
};

export function sumBy<T>(rows: T[], pick: (x: T) => number) {
  return rows.reduce((acc, r) => acc + (Number(pick(r)) || 0), 0);
}

// --- extra helpers for AY / YTD / YoY ---
import type { SalesRow, PeriodKey } from "../types";
import { isInAcademicYear, academicYearOf, comparePeriod } from "../utils/date";

export function groupByKey<T, K extends string | number>(arr: T[], keyFn: (t: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = keyFn(item) as any;
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function filterByAcademicYear(rows: SalesRow[], ay: string, ayStartMonth = 9) {
  return rows.filter((r) => isInAcademicYear(r.month as PeriodKey, ay, ayStartMonth));
}

export function totalsByMonth(rows: SalesRow[]) {
  const byMonth = groupByKey(rows, (r) => r.month);
  const months = Object.keys(byMonth).sort(comparePeriod);
  return months.map((m) => {
    const bucket = byMonth[m];
    return {
      month: m as PeriodKey,
      actualSales: sumBy(bucket, (r) => r.actualSales),
      forecastSales: sumBy(bucket, (r) => r.forecastSales),
      actualCommission: sumBy(bucket, (r) => r.actualCommission),
      forecastCommission: sumBy(bucket, (r) => r.forecastCommission),
    };
  });
}

export function ytdTotals(rows: SalesRow[], ay: string, ayStartMonth = 9) {
  const inAy = filterByAcademicYear(rows, ay, ayStartMonth);
  const months = totalsByMonth(inAy).sort((a, b) => comparePeriod(a.month, b.month));
  if (months.length === 0) return { actualSales: 0, forecastSales: 0, lastMonth: null as PeriodKey | null };
  // YTD up to the latest month present in data for that AY
  let a = 0, f = 0;
  for (const m of months) { a += m.actualSales; f += m.forecastSales; }
  return { actualSales: a, forecastSales: f, lastMonth: months[months.length - 1].month };
}

export function yoyVsPrevAY(rows: SalesRow[], ay: string, ayStartMonth = 9) {
  // Compare cumulative Actual Sales (and Forecast) of AY with previous AY, up to last common month
  const [y1, y2] = ay.split("-").map((x) => Number(x));
  const prevAy = `${y1 - 1}-${y1}`;
  const curMonths = totalsByMonth(filterByAcademicYear(rows, ay, ayStartMonth));
  const prevMonths = totalsByMonth(filterByAcademicYear(rows, prevAy, ayStartMonth));
  const commonLen = Math.min(curMonths.length, prevMonths.length);
  const curCum = curMonths.slice(0, commonLen).reduce((s, m) => s + m.actualSales, 0);
  const prevCum = prevMonths.slice(0, commonLen).reduce((s, m) => s + m.actualSales, 0);
  const delta = curCum - prevCum;
  const pct = prevCum === 0 ? null : delta / prevCum;
  return {
    current: { actual: curCum, months: commonLen },
    previous: { actual: prevCum, months: commonLen, ay: prevAy },
    delta, pct,
  };
}
