'use client';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
export default function MonthlyActual({ data }: { data: { month: string; actual: number }[] }) {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="mb-2 font-semibold">Monthly Actual Sales</div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" /><YAxis />
            <Tooltip formatter={(v:number)=> new Intl.NumberFormat().format(v)} />
            <Line type="monotone" dataKey="actual" name="Actual" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
