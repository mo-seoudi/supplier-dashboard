import type { SalesRow } from "../types";
import { variance, percentDiff } from "../lib/metrics";
import { formatCurrency } from "../utils/format";
export default function SalesTable({ rows }: { rows: SalesRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>School</Th><Th>Income Type</Th><Th>Month</Th>
            <Th className="text-right">Actual</Th><Th className="text-right">Forecast</Th>
            <Th className="text-right">Var</Th><Th className="text-right">%Diff</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const diff = variance(r.actualSales, r.forecastSales);
            const pct = percentDiff(r.actualSales, r.forecastSales);
            return (
              <tr key={i} className="border-t">
                <Td>{r.schoolName ?? r.schoolId}</Td>
                <Td>{r.incomeTypeName ?? r.incomeTypeId}</Td>
                <Td>{r.month}</Td>
                <Td className="text-right">{formatCurrency(r.actualSales, r.currency)}</Td>
                <Td className="text-right">{formatCurrency(r.forecastSales, r.currency)}</Td>
                <Td className={`text-right ${diff < 0 ? "text-red-600" : "text-green-700"}`}>{formatCurrency(diff, r.currency)}</Td>
                <Td className="text-right">{pct === null ? "—" : (pct * 100).toFixed(1) + "%"}</Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function Th({ children, className = "" }:{ children: React.ReactNode; className?: string }){ return <th className={`px-3 py-2 text-left font-medium ${className}`}>{children}</th>; }
function Td({ children, className = "" }:{ children: React.ReactNode; className?: string }){ return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
