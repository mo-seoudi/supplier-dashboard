import { readFileSync } from "fs";
import { join } from "path";
import type { SalesRow } from "../types";

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
