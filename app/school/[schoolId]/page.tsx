import { getRows } from "../../../lib/data";
import { sumBy, variance, percentDiff, filterByAcademicYear, ytdTotals, yoyVsPrevAY } from "../../../lib/metrics";
import type { SalesRow } from "../../../types";

export default function SchoolPage({ params, searchParams }: { params: { schoolId: string }; searchParams: { ay?: string } }) {
  const all = getRows();
  const schoolId = decodeURIComponent(params.schoolId);
  const schoolRows = all.filter((r) => r.schoolId === schoolId);
  if (schoolRows.length === 0) {
    return <main className="space-y-6"><h1 className="text-xl font-semibold">School not found</h1></main>;
  }
  const schoolName = schoolRows.find((r) => r.schoolName)?.schoolName ?? schoolId;

  // Determine AY: use ?ay=YYYY-YYYY or default to the most recent seen in data
  const distinctAYs = Array.from(new Set(schoolRows.map((r) => r.academicYear))).sort();
  const ay = searchParams.ay && distinctAYs.includes(searchParams.ay) ? searchParams.ay : distinctAYs[distinctAYs.length - 1];

  const rowsAy = filterByAcademicYear(schoolRows, ay);
  const currency = rowsAy[0]?.currency || "AED";

  const totalActual = sumBy(rowsAy, (r) => r.actualSales);
  const totalForecast = sumBy(rowsAy, (r) => r.forecastSales);
  const diff = variance(totalActual, totalForecast);
  const pct = percentDiff(totalActual, totalForecast);
  const ytd = ytdTotals(schoolRows, ay);
  const yoy = yoyVsPrevAY(schoolRows, ay);

  return (
    <main className="space-y-6">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">{schoolName}</h1>
        <AySwitcher schoolId={schoolId} ay={ay} ays={distinctAYs} />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Kpi label={`AY ${ay} Actual`} value={totalActual} currency={currency} />
        <Kpi label={`AY ${ay} Forecast`} value={totalForecast} currency={currency} />
        <Kpi label="Variance" value={diff} currency={currency} hint={pct} trend={diff >= 0 ? "up" : "down"} />
        <Kpi label={`YTD (to ${ytd.lastMonth ?? "—"})`} value={ytd.actualSales} currency={currency} hint={percentDiff(ytd.actualSales, ytd.forecastSales)} />
      </section>

      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-2">YoY vs Previous AY</h2>
        <div className="text-sm text-gray-700">
          Current AY cumulative: <b>{fmtCurrency(yoy.current.actual, currency)}</b> &nbsp;|&nbsp;
          Previous ({yoy.previous.ay}) cumulative: <b>{fmtCurrency(yoy.previous.actual, currency)}</b> &nbsp;|&nbsp;
          Delta: <b className={yoy.delta >= 0 ? "text-green-700" : "text-red-600"}>{fmtCurrency(yoy.delta, currency)}</b> &nbsp;|&nbsp;
          {yoy.pct === null ? "% change: —" : `% change: ${(yoy.pct * 100).toFixed(1)}%`}
        </div>
      </section>

      <MonthlyTable rows={rowsAy} />
    </main>
  );
}

// --- Local light components (kept inline for simplicity) ---
function Kpi({ label, value, hint, currency, trend }: { label: string; value: number; hint?: number | null; currency?: string; trend?: "up"|"down" }) {
  const formatted = currency ? new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value ?? 0)
                             : new Intl.NumberFormat().format(value ?? 0);
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{formatted}</div>
      {hint !== undefined && (
        <div className={`text-sm mt-0.5 ${trend === "down" ? "text-red-600" : "text-green-600"}`}>
          {hint === null ? "—" : new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(hint)}
        </div>
      )}
    </div>
  );
}

function AySwitcher({ schoolId, ay, ays }: { schoolId: string; ay: string; ays: string[] }) {
  return (
    <div className="flex gap-2 text-sm">
      {ays.map((opt) => (
        <a key={opt} href={`/school/${encodeURIComponent(schoolId)}?ay=${encodeURIComponent(opt)}`}
           className={`rounded-full border px-3 py-1 ${opt === ay ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`}>
          {opt}
        </a>
      ))}
    </div>
  );
}

function MonthlyTable({ rows }: { rows: SalesRow[] }) {
  // simple sort: by month then incomeType
  const copy = [...rows].sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : (a.incomeTypeName ?? a.incomeTypeId).localeCompare(b.incomeTypeName ?? b.incomeTypeId)));

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>Month</Th><Th>Income Type</Th>
            <Th className="text-right">Actual</Th>
            <Th className="text-right">Forecast</Th>
            <Th className="text-right">Var</Th>
            <Th className="text-right">%Diff</Th>
          </tr>
        </thead>
        <tbody>
          {copy.map((r, i) => {
            const diff = (r.actualSales ?? 0) - (r.forecastSales ?? 0);
            const pct = !r.forecastSales ? null : diff / r.forecastSales;
            return (
              <tr key={i} className="border-t">
                <Td>{r.month}</Td>
                <Td>{r.incomeTypeName ?? r.incomeTypeId}</Td>
                <Td className="text-right">{fmtCurrency(r.actualSales, r.currency)}</Td>
                <Td className="text-right">{fmtCurrency(r.forecastSales, r.currency)}</Td>
                <Td className={`text-right ${diff < 0 ? "text-red-600" : "text-green-700"}`}>{fmtCurrency(diff, r.currency)}</Td>
                <Td className="text-right">{pct === null ? "—" : (pct * 100).toFixed(1) + "%"}</Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function fmtCurrency(v: number, ccy = "AED") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(v ?? 0);
}
