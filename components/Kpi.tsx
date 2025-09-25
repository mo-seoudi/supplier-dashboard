import { formatCurrency } from "../utils/format";
export default function Kpi({ label, value, currency }:{ label: string; value: number; currency?: string }) {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{formatCurrency(value, currency)}</div>
    </div>
  );
}
