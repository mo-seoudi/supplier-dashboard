'use client';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
export default function YtdProgress({ data }:{ data:{ month:string; actualCum:number; forecastCum:number }[] }){
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="mb-2 font-semibold">YTD Progress</div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" /><YAxis />
            <Tooltip formatter={(v:number)=> new Intl.NumberFormat().format(v)} />
            <Legend />
            <Area type="monotone" dataKey="actualCum" name="Actual (cum)" strokeWidth={2} fillOpacity={0.2} />
            <Area type="monotone" dataKey="forecastCum" name="Forecast (cum)" strokeWidth={2} fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
