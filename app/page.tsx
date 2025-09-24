import { getRows, getOptions, parseFilters, applyFilters } from "../lib/data";
import { sumBy, variance, percentDiff } from "../lib/metrics";
import Kpi from "../components/Kpi";
import SalesTable from "../components/SalesTable";
import FilterBar from "../components/filters/FilterBar";
import ActualVsForecast from "../components/charts/ActualVsForecast";
import YtdProgress from "../components/charts/YtdProgress";

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const rows = getRows();
  const { schools, types, ays } = getOptions(rows);
  const fallbackAy = ays[ays.length - 1];
  const filters = parseFilters(searchParams, fallbackAy);
  const sliced = applyFilters(rows, filters);

  const currency = sliced[0]?.currency || "AED";
  const totalActual = sumBy(sliced, (r) => r.actualSales);
  const totalForecast = sumBy(sliced, (r) => r.forecastSales);
  const diff = variance(totalActual, totalForecast);
  const pct = percentDiff(totalActual, totalForecast);

  // Chart data
  const byMonth = new Map<string, { month: string; actual: number; forecast: number; actualCum: number; forecastCum: number }>();
  const sorted = [...sliced].sort((a,b)=> a.month < b.month ? -1 : a.month > b.month ? 1 : 0);
  let aCum = 0, fCum = 0;
  for (const r of sorted) {
    const key = r.month;
    const obj = byMonth.get(key) || { month: key, actual: 0, forecast: 0, actualCum: 0, forecastCum: 0 };
    obj.actual += r.actualSales;
    obj.forecast += r.forecastSales;
    byMonth.set(key, obj);
  }
  const monthly = Array.from(byMonth.values()).sort((a,b)=> a.month < b.month ? -1 : 1);
  for (const m of monthly) { aCum += m.actual; fCum += m.forecast; m.actualCum = aCum; m.forecastCum = fCum; }

  return (
    <div className="space-y-6">
      <FilterBar ays={ays} schools={schools} types={types} ay={filters.ay || fallbackAy} />
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Total Sales (Actual)" value={totalActual} currency={currency} />
        <Kpi label="Total Sales (Forecast)" value={totalForecast} currency={currency} />
        <Kpi label="Variance" value={diff} currency={currency} hint={pct} trend={diff >= 0 ? "up" : "down"} />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActualVsForecast data={monthly.map(m => ({ month: m.month, actual: m.actual, forecast: m.forecast }))} />
        <YtdProgress data={monthly.map(m => ({ month: m.month, actualCum: m.actualCum, forecastCum: m.forecastCum }))} />
      </section>
      <SalesTable rows={sliced} />
    </div>
  );
}
