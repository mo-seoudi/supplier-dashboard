import { getRows } from "../lib/data";
import { sumBy, variance, percentDiff } from "../lib/metrics";
import Kpi from "../components/Kpi";
import SalesTable from "../components/SalesTable";

export default function Page() {
  const rows = getRows();

  const totalActual = sumBy(rows, (r) => r.actualSales);
  const totalForecast = sumBy(rows, (r) => r.forecastSales);
  const diff = variance(totalActual, totalForecast);
  const pct = percentDiff(totalActual, totalForecast);

  const currency = rows[0]?.currency || "AED";

  return (
    <main className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Total Sales (Actual)" value={totalActual} currency={currency} />
        <Kpi label="Total Sales (Forecast)" value={totalForecast} currency={currency} />
        <Kpi label="Variance" value={diff} currency={currency} hint={pct} trend={diff >= 0 ? "up" : "down"} />
      </section>

      <SalesTable rows={rows} />
    </main>
  );
}
