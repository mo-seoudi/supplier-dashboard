import { getRows, getOptions, parseFilters, applyFilters } from "../lib/data";
import { sumBy } from "../lib/metrics";
import Kpi from "../components/Kpi";
import AcademicYearPicker from "../components/filters/AcademicYearPicker";
import SchoolSelect from "../components/filters/SchoolSelect";
import IncomeTypeSelect from "../components/filters/IncomeTypeSelect";
import MonthRangeDropdown from "../components/filters/MonthRangeDropdown";
import MonthlyActual from "../components/charts/MonthlyActual";
import CompareSchoolsBar from "../components/charts/CompareSchoolsBar";

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const rows = getRows();

  // If no data at all, show a friendly message instead of crashing
  if (!rows.length) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-lg font-semibold">No data found</div>
          <p className="text-sm text-gray-600 mt-1">
            Please add your file at <code>public/data/sales.json</code> and redeploy.
          </p>
        </div>
      </div>
    );
  }

  const { schools, types, ays } = getOptions(rows);
  const fallbackAy = ays.length ? ays[ays.length - 1] : undefined;
  const filters = parseFilters(searchParams, fallbackAy);

  const sliced = applyFilters(rows, filters);
  const currency = sliced[0]?.currency || rows[0]?.currency || "AED";

  const kpiActualSales = sumBy(sliced, (r) => r.actualSales);
  const kpiActualCommission = sumBy(sliced, (r) => r.actualCommission);

  const monthlyMap = new Map<string, number>();
  for (const r of sliced) monthlyMap.set(r.month, (monthlyMap.get(r.month) || 0) + r.actualSales);
  const monthly = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, actual]) => ({ month, actual }));

  // Compare chart ignores "School" filter but respects AY/Months/Type
  const { school, ...restFilters } = filters;
  const compareSlice = applyFilters(rows, restFilters);
  const bySchool = new Map<string, { name: string; val: number }>();
  for (const r of compareSlice) {
    const name = r.schoolName ?? r.schoolId;
    const o = bySchool.get(r.schoolId) || { name, val: 0 };
    o.val += r.actualSales;
    bySchool.set(r.schoolId, o);
  }
  const compareArr = Array.from(bySchool.values())
    .sort((a, b) => b.val - a.val)
    .slice(0, 12)
    .map((o) => ({ school: o.name, actual: o.val }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AcademicYearPicker options={ays} />
          <SchoolSelect options={schools} />
          <IncomeTypeSelect options={types} />
          <MonthRangeDropdown ay={filters.ay || fallbackAy} />
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Kpi label="Actual Sales" value={kpiActualSales} currency={currency} />
        <Kpi label="Actual Commission" value={kpiActualCommission} currency={currency} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyActual data={monthly} />
        <CompareSchoolsBar data={compareArr} currency={currency} />
      </section>
    </div>
  );
}
