'use client';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
export default function CompareSchoolsBar({ data, currency }: { data: { school: string; actual: number }[]; currency: string }) {
  const fmt = (v:number) => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(v ?? 0);
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="mb-2 font-semibold">Compare Schools (Selected Period)</div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="school" /><YAxis />
            <Tooltip formatter={(v:number)=> fmt(v)} />
            <Bar dataKey="actual" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
