// File: /src/pages/Dashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Download } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";

/**
 * High‑End Sales Dashboard
 * ----------------------------------------
 * Drop this file into a Next.js / Vite + React app. The component expects a JSON file
 * shaped like the one I exported for you (sales_tidy.json). Put that file in /public/data/
 * as /public/data/sales_tidy.json and it will be fetched automatically.
 *
 * Record shape:
 * { category: string, date: "YYYY-MM-DD", school: string, metric: "Sales"|"Commission"|"Sales Forecast"|"Commission Forecast", value: number }
 */

// Lightweight currency formatter
const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Utility: parse and sort dates ascending
function toDate(d) { return new Date(d + "T00:00:00"); }

export default function SalesDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [school, setSchool] = useState("All");
  const [metric, setMetric] = useState("Sales");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("overview");

  // Fetch data from public path. If it fails (e.g., during preview), fall back to tiny inline sample
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/sales_tidy.json");
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setRows(data);
      } catch (e) {
        // Minimal inline sample for previewing the UI without the JSON present
        setRows([
          { category: "Uniform", date: "2024-01-01", school: "RDXB", metric: "Sales", value: 221000 },
          { category: "Uniform", date: "2024-02-01", school: "RDXB", metric: "Sales", value: 185000 },
          { category: "Uniform", date: "2024-03-01", school: "RDXB", metric: "Sales", value: 277000 },
          { category: "Catering", date: "2024-01-01", school: "RDXB", metric: "Sales", value: 54000 },
          { category: "Catering", date: "2024-02-01", school: "RDXB", metric: "Sales", value: 49000 },
          { category: "Catering", date: "2024-03-01", school: "RDXB", metric: "Sales", value: 62000 },
          { category: "Uniform", date: "2024-01-01", school: "ROSE", metric: "Sales", value: 43000 },
          { category: "Uniform", date: "2024-02-01", school: "ROSE", metric: "Sales", value: 39000 },
          { category: "Uniform", date: "2024-03-01", school: "ROSE", metric: "Sales", value: 45500 },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Basic dimension values
  const categories = useMemo(() => ["All", ...Array.from(new Set(rows.map(r => r.category))).sort()], [rows]);
  const schools = useMemo(() => ["All", ...Array.from(new Set(rows.map(r => r.school))).sort()], [rows]);
  const metrics = ["Sales", "Commission", "Sales Forecast", "Commission Forecast"]; // fixed

  // Filter rows
  const filtered = useMemo(() => rows
    .filter(r => (category === "All" || r.category === category))
    .filter(r => (school === "All" || r.school === school))
    .filter(r => r.metric === metric)
    .filter(r => !query || r.school.toLowerCase().includes(query.toLowerCase())), [rows, category, school, metric, query]);

  // Series: group by date across schools for the chart (so you can compare schools at a point in time)
  const byDate = useMemo(() => {
    const map = new Map();
    filtered.forEach(r => {
      const key = r.date;
      if (!map.has(key)) map.set(key, { date: key });
      map.get(key)[r.school] = (map.get(key)[r.school] || 0) + r.value;
    });
    return Array.from(map.values()).sort((a, b) => toDate(a.date) - toDate(b.date));
  }, [filtered]);

  // Series: totals by school (for a bar chart / leaderboard)
  const bySchool = useMemo(() => {
    const m = new Map();
    filtered.forEach(r => m.set(r.school, (m.get(r.school) || 0) + r.value));
    return Array.from(m.entries()).map(([school, total]) => ({ school, total })).sort((a,b) => b.total - a.total);
  }, [filtered]);

  // KPI: latest month total, trend vs prev month
  const kpis = useMemo(() => {
    if (byDate.length < 1) return { latest: 0, changeMoM: 0 };
    const last = byDate[byDate.length - 1];
    const prev = byDate[byDate.length - 2];
    const latest = Object.entries(last).filter(([k]) => k !== "date").reduce((s, [,v]) => s + (v || 0), 0);
    const prevSum = prev ? Object.entries(prev).filter(([k]) => k !== "date").reduce((s, [,v]) => s + (v || 0), 0) : 0;
    const changeMoM = prevSum ? (latest - prevSum) / prevSum : 0;
    return { latest, changeMoM };
  }, [byDate]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-slate-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Sales Performance</h1>
            <p className="text-slate-600 mt-1">Interactive dashboard generated from your Excel structure.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl"><CalendarDays className="mr-2 h-4 w-4"/>Monthly</Button>
            <Button className="rounded-2xl" onClick={() => window.open("/data/sales_tidy.json", "_blank") }>
              <Download className="mr-2 h-4 w-4"/> Export JSON
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <Card className="col-span-2">
            <CardContent className="p-3 sm:p-4">
              <label className="text-xs text-slate-500">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-2xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <label className="text-xs text-slate-500">School</label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger className="rounded-2xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {schools.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <label className="text-xs text-slate-500">Metric</label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="rounded-2xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {metrics.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <label className="text-xs text-slate-500">Search school</label>
              <Input className="rounded-2xl mt-1" placeholder="Type to filter…" value={query} onChange={e => setQuery(e.target.value)} />
            </CardContent>
          </Card>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="text-xs text-slate-500">Latest {metric} total</div>
              <div className="text-3xl font-semibold mt-1">{fmt.format(kpis.latest || 0)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="text-xs text-slate-500">MoM change</div>
              <div className={`text-3xl font-semibold mt-1 ${kpis.changeMoM >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {(kpis.changeMoM * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="text-xs text-slate-500">Active schools</div>
              <div className="text-3xl font-semibold mt-1">{bySchool.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="rounded-2xl grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="overview" className="rounded-2xl"><LineChartIcon className="mr-2 h-4 w-4"/>Trend</TabsTrigger>
            <TabsTrigger value="leaders" className="rounded-2xl"><BarChart3 className="mr-2 h-4 w-4"/>Leaders</TabsTrigger>
            <TabsTrigger value="mix" className="rounded-2xl"><PieChartIcon className="mr-2 h-4 w-4"/>Mix</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-slate-600 mb-2">{metric} trend by school</div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={byDate} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                      <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", year: "2-digit" })} />
                      <YAxis tickFormatter={(n) => (n >= 1000 ? `${Math.round(n/1000)}k` : `${n}`)} />
                      <Tooltip formatter={(v) => fmt.format(v as number)} labelFormatter={(d) => new Date(d as string).toLocaleDateString()} />
                      {schools.filter(s => s !== "All").slice(0, 8).map((s) => (
                        <Line key={s} type="monotone" dataKey={s} dot={false} strokeWidth={2} />
                      ))}
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaders" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-slate-600 mb-2">Top schools by total {metric}</div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bySchool.slice(0, 15)} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                      <XAxis dataKey="school" interval={0} angle={-20} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(n) => (n >= 1000 ? `${Math.round(n/1000)}k` : `${n}`)} />
                      <Tooltip formatter={(v) => fmt.format(v as number)} />
                      <Bar dataKey="total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mix" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-slate-600 mb-2">{category === "All" ? "Category mix" : `${category} mix by school`}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {(() => {
                          const series = (() => {
                            if (category === "All") {
                              const m = new Map();
                              rows.filter(r => r.metric === metric).forEach(r => m.set(r.category, (m.get(r.category) || 0) + r.value));
                              return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
                            } else {
                              const m = new Map();
                              rows.filter(r => r.metric === metric && r.category === category).forEach(r => m.set(r.school, (m.get(r.school) || 0) + r.value));
                              return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
                            }
                          })();
                          return (
                            <Pie data={series} dataKey="value" nameKey="name" outerRadius={100}>
                              {series.map((_, i) => (<Cell key={i} />))}
                            </Pie>
                          );
                        })()}
                        <Tooltip formatter={(v) => fmt.format(v as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-2xl p-4 border bg-white">
                    <div className="text-sm font-medium mb-2">Details</div>
                    <div className="max-h-60 overflow-auto text-sm">
                      {bySchool.slice(0, 20).map((row, i) => (
                        <div key={row.school} className="flex items-center justify-between py-1 border-b last:border-b-0">
                          <span className="text-slate-600">{i+1}. {row.school}</span>
                          <span className="font-medium">{fmt.format(row.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-xs text-slate-500 pt-6">Built with React + Tailwind + shadcn/ui + Recharts. Replace the inline sample with your exported JSON for full fidelity to your Excel report.</footer>
      </div>
    </div>
  );
}


