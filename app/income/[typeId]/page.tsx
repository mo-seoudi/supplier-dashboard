import { getRows, getOptions, parseFilters, applyFilters } from "../../../lib/data";
import { sumBy } from "../../../lib/metrics";
import Kpi from "../../../components/Kpi";
import AcademicYearPicker from "../../../components/filters/AcademicYearPicker";
import SchoolSelect from "../../../components/filters/SchoolSelect";
import MonthSelect from "../../../components/filters/MonthSelect";
import MonthlyActual from "../../../components/charts/MonthlyActual";
import IncomeMonthlyTable from "../../../components/tables/IncomeMonthlyTable";
import { monthsForAY } from "../../../utils/date";

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

  // Force the type filter to the URL param (ignore any 'types' in the URL)
  const base = parseFilters(searchParams, fallbackAy);
  const filters = { ...base, types: [params.typeId] };

  const sliced = applyFilters(rows, filters);
  const currency = sliced[0]?.currency || rows[0]?.currency || "AED";

  const totalActual = sumBy(sliced, (r) => r.actualSales);
  const totalComm = sumBy(sliced, (r) => r.actualCommission);

  // Monthly series for the chart (respects filters)
  const monthlyMap = new Map<string, number>();
  for (const r of sliced) monthlyMap.set(r.month, (monthlyMap.get(r.month) || 0) + r.actualSales);
  const monthly = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, actual]) => ({ month, actual }));

  const thisTypeName =
    types.find((t) => t.id === params.typeId)?.name ?? params.typeId;

  // -------
  // Table inputs
  // -------
  const activeAy = filters.ay || fallbackAy;
  let monthList = activeAy ? monthsForAY(activeAy) : [];
  if (activeAy && filters.months?.start && filters.months?.end) {
    const all = monthsForAY(activeAy);
    const sIdx = all.indexOf(filters.months.start);
    const eIdx = all.indexOf(filters.months.end);
    if (sIdx !== -1 && eIdx !== -1) {
      const a = Math.min(sIdx, eIdx);
      const b = Math.max(sIdx, eIdx);
      monthList = all.slice(a, b + 1);
    }
  }

  const schoolName = filters.school
    ? schools.find((s) => s.id === filters.school)?.name ?? filters.school
    : "";

  // rows for the table must be one school + this income type (already enforced by filters)
  const tableRows = filters.school ? sliced : [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border p-4 bg-white">
        <div className="text-lg font-semibold">Income Type: {thisTypeName}</div>
        <p className="text-sm text-gray-600">
          Filters apply to AY, School, and Month (income type is fixed by the URL).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <AcademicYearPicker options={ays} />
          <SchoolSelect options={schools} />
          <MonthSelect ay={filters.ay || fallbackAy} />
        </div>
      </div>
 
      {/* Monthly details table (per school) */}
      {filters.school ? (
        <IncomeMonthlyTable
          incomeTypeName={thisTypeName}
          schoolName={schoolName}
          rows={tableRows}
          months={monthList}
          currency={currency}
        />
      ) : (
        <div className="rounded-2xl border p-4 bg-white text-sm text-gray-600">
          Select a <span className="font-medium">School</span> to view the monthly details table.
        </div>
      )}
      
      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Kpi label="Actual Sales" value={totalActual} currency={currency} />
        <Kpi label="Actual Commission" value={totalComm} currency={currency} />
      </section>

      {/* Chart */}
      <MonthlyActual data={monthly} />


    </div>
  );
}
