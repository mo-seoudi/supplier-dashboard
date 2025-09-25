'use client';

import type { SalesRow } from "../../types";
import { formatCurrency } from "../../utils/format";

/**
 * Renders a monthly table for ONE income type & ONE school.
 * Pass in the rows already filtered to that school + income type,
 * and (optionally) an ordered list of months to display.
 */
export default function IncomeMonthlyTable({
  incomeTypeName,
  schoolName,
  rows,
  months,              // array of "YYYY-MM" in display order (optional)
  currency,            // fallback if rows are empty
}: {
  incomeTypeName: string;
  schoolName: string;
  rows: SalesRow[];
  months?: string[];
  currency?: string;
}) {
  // make a fast lookup by month
  const byMonth = new Map<string, SalesRow>();
  for (const r of rows) byMonth.set(r.month, r);

  // choose display months
  const displayMonths: string[] =
    months && months.length
      ? months
      : Array.from(new Set(rows.map((r) => r.month))).sort(); // fallback

  const ccy = rows[0]?.currency || currency || "AED";

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-[720px] w-full text-sm border-collapse">
        <thead>
          <tr>
            {/* top-left header with income type; spans two header rows */}
            <th rowSpan={2} className="border-b border-r px-3 py-2 text-left font-semibold bg-gray-50">
              {incomeTypeName}
            </th>
            {/* school header across the four numeric columns */}
            <th colSpan={4} className="border-b px-3 py-2 text-center font-semibold bg-gray-50">
              {schoolName}
            </th>
          </tr>
          <tr className="bg-gray-50">
            <Th>Sales</Th>
            <Th>Commission</Th>
            <Th>Sales Forecast</Th>
            <Th>Commission Forecast</Th>
          </tr>
        </thead>
        <tbody>
          {displayMonths.map((m) => {
            const r = byMonth.get(m);
            return (
              <tr key={m} className="border-t">
                <td className="border-r px-3 py-2 text-left whitespace-nowrap text-gray-700 font-medium">
                  {fmtMonth(m)}
                </td>
                <TdRight>{r ? formatCurrency(r.actualSales, ccy) : "—"}</TdRight>
                <TdRight>{r ? formatCurrency(r.actualCommission, ccy) : "—"}</TdRight>
                <TdRight>{r ? formatCurrency(r.forecastSales, ccy) : "—"}</TdRight>
                <TdRight>{r ? formatCurrency(r.forecastCommission, ccy) : "—"}</TdRight>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="border-b px-3 py-2 text-right font-medium">{children}</th>;
}
function TdRight({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-right">{children}</td>;
}

/** "YYYY-MM" -> "Mmm-yy" e.g., "Sep-23" */
function fmtMonth(m: string) {
  const [y, mm] = m.split("-").map(Number);
  const d = new Date(y, mm - 1, 1);
  const mon = d.toLocaleString(undefined, { month: "short" });
  const yy = String(y).slice(-2);
  return `${mon}-${yy}`;
}
