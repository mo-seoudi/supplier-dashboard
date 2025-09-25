import { getRows, getOptions, parseFilters, applyFilters } from "../../../lib/data";
import { sumBy } from "../../../lib/metrics";
import Kpi from "../../../components/Kpi";
import AcademicYearPicker from "../../../components/filters/AcademicYearPicker";
import SchoolSelect from "../../../components/filters/SchoolSelect";
import MonthRangeCalendar from "../../../components/filters/MonthRangeCalendar";
import MonthlyActual from "../../../components/charts/MonthlyActual";

export default function IncomeTypePage({
  params,
  searchParams,
}: {
  params: { typeId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const rows = getRows();
  const { ays, schools, types } = getOptions(rows);
  const fallbackAy = ays[ays.length - 1];

  // Force the type filter to the URL param (ignore any types in URL)
  const base = parseFilters(searchParams, fallbackAy);
  const filters = { ...base, types: [params.typeId] };

  const sliced = applyFilters(rows, filters);
  const currency = sliced[0]?.currency || rows[0]?.currency || "AED";

  const totalActual = sumBy(sliced, (r) => r.actualSales);
  const totalComm = sumBy(sliced, (r) => r.actualCommission);

  // Monthly series
  const monthlyMap = new Map<string, number>();
  for (const r of sliced) monthlyMap.set(r.month, (monthlyMap.get(r.month) || 0) + r.actualSales);
  const monthly = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, actual]) => ({ month, actual }));

  const thisTypeName =
    types.find((t) => t.id === params.typeId)?.name ?? params.typeId;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4 bg-white">
        <div className="text-lg font-semibold">Income Type: {thisTypeName}</div>
        <p className="text-sm text-gray-600">Filters apply only to AY, School, and Months (type is fixed by the URL).</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <AcademicYearPicker options={ays} />
          <SchoolSelect options={schools} />
          <MonthRangeCalendar ay={filters.ay || fallbackAy} />
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Kpi label="Actual Sales" value={totalActual} currency={currency} />
        <Kpi label="Actual Commission" value={totalComm} currency={currency} />
      </section>

      <MonthlyActual data={monthly} />
    </div>
  );
}
