import { getRows, getOptions, parseFilters, applyFilters } from "../../lib/data";
import FilterBar from "../../components/filters/FilterBar";

export default function ComparePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const rows = getRows();
  const { schools, types, ays } = getOptions(rows);
  const filters = parseFilters(searchParams, ays[ays.length - 1]);
  const sliced = applyFilters(rows, filters);

  const bySchool = new Map<string, { name: string; actual: number; forecast: number; pct: number | null }>();
  for (const r of sliced) {
    const o = bySchool.get(r.schoolId) || { name: r.schoolName ?? r.schoolId, actual: 0, forecast: 0, pct: null };
    o.actual += r.actualSales;
    o.forecast += r.forecastSales;
    bySchool.set(r.schoolId, o);
  }
  const rowsOut = Array.from(bySchool.entries()).map(([id, o]) => ({
    schoolId: id, schoolName: o.name, actual: o.actual, forecast: o.forecast, pct: o.forecast ? (o.actual - o.forecast) / o.forecast : null
  })).sort((a,b)=> (b.actual - a.actual));

  const currency = sliced[0]?.currency || "AED";

  return (
    <div className="space-y-6">
      <FilterBar ays={ays} schools={schools} types={types} ay={filters.ay!} />
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>School</Th><Th className="text-right">Actual</Th><Th className="text-right">Forecast</Th><Th className="text-right">%Diff</Th>
            </tr>
          </thead>
          <tbody>
            {rowsOut.map((r) => (
              <tr key={r.schoolId} className="border-t">
                <Td>{r.schoolName}</Td>
                <Td className="text-right">{fmtCurrency(r.actual, currency)}</Td>
                <Td className="text-right">{fmtCurrency(r.forecast, currency)}</Td>
                <Td className="text-right">{r.pct === null ? "—" : (r.pct * 100).toFixed(1) + "%"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Th({ children, className = "" }:{ children: React.ReactNode; className?: string }){ return <th className={`px-3 py-2 text-left font-medium ${className}`}>{children}</th>; }
function Td({ children, className = "" }:{ children: React.ReactNode; className?: string }){ return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
function fmtCurrency(v: number, ccy = "AED") { return new Intl.NumberFormat(undefined, { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(v ?? 0); }
