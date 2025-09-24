import { formatCurrency, formatPercent } from "../utils/format";

export default function Kpi({
  label,
  value,
  hint,
  currency,
  trend
}: {
  label: string;
  value: number;
  hint?: number | null;
  currency?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">
        {currency ? formatCurrency(value, currency) : new Intl.NumberFormat().format(value)}
      </div>
      {hint !== undefined && (
        <div className={`text-sm mt-0.5 ${trend === "down" ? "text-red-600" : "text-green-600"}`}>
          {typeof hint === "number" ? formatPercent(hint) : "—"}
        </div>
      )}
    </div>
  );
}
