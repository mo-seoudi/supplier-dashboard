import { readFileSync } from "fs";
import { join } from "path";
import type { SalesRow } from "../types";

export interface Filters {
  school?: string | null;
  types?: string[] | null;
  ay?: string | null;
  months?: { start: string; end: string } | null;
}

export function getRows(): SalesRow[] {
  const file = join(process.cwd(), "public", "data", "sales.json");
  const raw = readFileSync(file, "utf8");
  const rows = JSON.parse(raw) as SalesRow[];
  return rows.map((r) => ({
    ...r,
    actualSales: Number(r.actualSales) || 0,
    forecastSales: Number(r.forecastSales) || 0,
    actualCommission: Number(r.actualCommission) || 0,
    forecastCommission: Number(r.forecastCommission) || 0,
    currency: (r.currency || "AED").toUpperCase(),
  }));
}

export function getOptions(rows: SalesRow[]) {
  const schoolsMap = new Map<string, string>();
  rows.forEach((r) => schoolsMap.set(r.schoolId, r.schoolName ?? r.schoolId));
  const schools = Array.from(schoolsMap, ([id, name]) => ({ id, name })).sort((a,b)=>a.name.localeCompare(b.name));

  const typesMap = new Map<string, string>();
  rows.forEach((r) => typesMap.set(r.incomeTypeId, r.incomeTypeName ?? r.incomeTypeId));
  const types = Array.from(typesMap, ([id, name]) => ({ id, name })).sort((a,b)=>a.name.localeCompare(b.name));

  const ays = Array.from(new Set(rows.map((r) => r.academicYear))).sort();

  return { schools, types, ays };
}

export function parseFilters(searchParams: { [key: string]: string | string[] | undefined }, fallbackAy?: string) : Filters {
  const school = typeof searchParams["school"] === "string" ? searchParams["school"] : null;
  const typesStr = typeof searchParams["types"] === "string" ? (searchParams["types"] as string) : null;
  const types = typesStr ? typesStr.split(",").map((s)=>s.trim()).filter(Boolean) : null;
  const ay = typeof searchParams["ay"] === "string" ? searchParams["ay"] as string : (fallbackAy ?? null);
  const monthsStr = typeof searchParams["months"] === "string" ? (searchParams["months"] as string) : null;
  let months: Filters["months"] = null;
  if (monthsStr && monthsStr.includes("..")) {
    const [start, end] = monthsStr.split("..");
    months = { start, end };
  }
  return { school, types, ay, months };
}

export function applyFilters(rows: SalesRow[], f: Filters): SalesRow[] {
  let out = rows;
  if (f.school) out = out.filter((r) => r.schoolId === f.school);
  if (f.types && f.types.length) out = out.filter((r) => f.types!.includes(r.incomeTypeId));
  if (f.ay) out = out.filter((r) => r.academicYear === f.ay);
  if (f.months) {
    const [sY, sM] = f.months.start.split("-").map((x) => Number(x));
    const [eY, eM] = f.months.end.split("-").map((x) => Number(x));
    const startNum = sY * 100 + sM;
    const endNum = eY * 100 + eM;
    out = out.filter((r) => {
      const [y, m] = r.month.split("-").map((x) => Number(x));
      const n = y * 100 + m;
      return n >= startNum && n <= endNum;
    });
  }
  return out;
}
