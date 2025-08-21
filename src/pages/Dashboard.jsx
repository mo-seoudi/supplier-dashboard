import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/globals.css";

// Currency formatter
const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const toDate = (d) => new Date(d + "T00:00:00");

// Simple labelled <select>
function LabeledSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <select className="w-full mt-1 rounded-2xl border px-3 py-2 bg-white" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// Simple tabs
function TabsHeader({ tab, setTab }) {
  const base = "rounded-2xl px-3 py-2 text-sm border transition";
  const active = "bg-black text-white border-black";
  const idle = "bg-white text-slate-700 border-slate-200";
  return (
    <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
      <button className={`${base} ${tab === "overview" ? active : idle}`} onClick={() => setTab("overview")}>Trend</button>
      <button className={`${base} ${tab === "leaders" ? active : idle}`} onClick={() => setTab("leaders")}>Leaders</button>
      <button className={`${base} ${tab === "mix" ? active : idle}`} onClick={() => setTab("mix")}>Mix</button>
    </div>
  );
}

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [school, setSchool] = useState("All");
  const [metric, setMetric] = useState("Sales");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("overview");

  // Fetch data from public path
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/sales_tidy.json");
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setRows(data);
      } catch {
        // falls back to inline sample (same as sales_tidy.json)
        setRows([
          { category: "Uniform", date: "2024-01-01", school: "RDXB", metric: "Sales", value: 221000 },
          { category: "Uniform", date: "2024-02-01", school: "RDXB", metric: "Sales", value: 185000 },
          { category: "Uniform", date: "2024-03-01", school: "RDXB", metric: "Sales", value: 277000 },
          { category: "Catering", date: "2024-01-01", school: "RDXB", metric: "Sales", value: 54000 },
          { category: "Catering", date: "2024-02-01", school: "RDXB", metric: "Sales", value: 49000 },
          { category: "Catering", date: "2024-03-01", school: "RDXB", metric: "Sales", value: 62000 },
          { category: "Uniform", date: "2024-01-01", school: "ROSE", metric: "Sales", value: 43000 },
          { category: "Uniform", date: "2024-02-01", school: "ROSE", metric: "Sales", value: 39000 },
          { category: "Uniform", date: "2024-03-01", school: "ROSE", metric: "Sales", value: 45500 }
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(rows.map(r => r.category))).sort()], [rows]);
  const schools = useMemo(() => ["All", ...Array.from(new Set(rows.map(r => r.school))).sort()], [rows]);
  const metrics = ["Sales", "Commission", "Sales Forecast", "Commission Forecast"];

  const filtered = useMemo(() =>
    rows
      .filter(r => (category === "All" || r.category === category))
      .filter(r => (school === "All" || r.school === school))
      .filter(r => r.metric === metric)
      .filter(r => !query || r.school.toLowerCase().includes(query.toLowerCase()))
  , [rows, category, school, metric, query]);

  const byDate = useMemo(() => {
    const map = new Map();
    filtered.forEach(r => {
      const key = r.date;
      if (!map.has(key)) map.set(key, { date: key });
      map.get(key)[r.school] = (map.get(key)[r.school] || 0) + r.value;
    });
    return Array.from(map.values()).sort((a, b) => toDate(a.date) - toDate(b.date));
  }, [filtered]);

  const bySchool = useMemo(() => {
    const m = new Map();
    filtered.forEach(r => m.set(r.school, (m.get(r.school) || 0) + r.value));
    return Array.from(m.entries()).map(([school, total]) => ({ school, total })).sort((a,b) => b.total - a.total);
  }, [filtered]);

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
            <Button variant="outline" className="rounded-2xl">Monthly</Button>
            <Button className="rounded-2xl" onClick={() => window.open("/data/sales_tidy.json", "_blank") }>Export JSON</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <Card className="col-span-2"><CardContent className="p-3 sm:p-4">
            <LabeledSelect label="Category" value={category} onChange={setCategory} options={categories} />
          </CardContent></Card>
          <Card><CardContent className="p-3 sm:p-4">
            <LabeledSelect label="School" value={school} onChange={setSchool} options={schools} />
          </CardContent></Card>
          <Card><CardContent className="p-3 sm:p-4">
            <LabeledSelect label="Metric" value={metric} onChange={setMetric} options={metrics} />
          </CardContent></Card>
          <Card><CardContent className="p-3 sm:p-4">
            <label className="text-xs text-slate-500">Search school</label>
            <input className="rounded-2xl mt-1 border px-3 py-2 w-full" placeholder="Type to filter…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </CardContent></Card>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-sm"><CardContent className="p-5">
            <div className="text-xs text-slate-500">Latest {metric} total</div>
            <div className="text-3xl font-semibold mt-1">{fmt.format(kpis.latest || 0)}</div>
          </CardContent></Card>
          <Card className="shadow-sm"><CardContent className="p-5">
            <div className="text-xs text-slate-500">MoM change</div>
            <div className={`text-3xl font-semibold mt-1 ${kpis.changeMoM >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{(kpis.changeMoM * 100).toFixed(1)}%</div>
          </CardContent></Card>
          <Card className="shadow-sm"><CardContent className="p-5">
            <div className="text-xs text-slate-500">Active schools</div>
            <div className="text-3xl font-semibold mt-1">{bySchool.length}</div>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <TabsHeader tab={tab} setTab={setTab} />

        {/* Trend */}
        {tab === "overview" && (
          <Card className="shadow-sm mt-4"><CardContent className="p-4">
            <div className="text-sm text-slate-600 mb-2">{metric} trend by school</div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byDate} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", year: "2-digit" })} />
                  <YAxis tickFormatter={(n) => (n >= 1000 ? `${Math.round(n/1000)}k` : `${n}`)} />
                  <Tooltip formatter={(v) => fmt.format(v)} labelFormatter={(d) => new Date(d).toLocaleDateString()} />
                  {schools.filter(s => s !== "All").slice(0, 8).map((s) => (
                    <Line key={s} type="monotone" dataKey={s} dot={false} strokeWidth={2} />
                  ))}
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent></Card>
        )}

        {/* Leaders */}
        {tab === "leaders" && (
          <Card className="shadow-sm mt-4"><CardContent className="p-4">
            <div className="text-sm text-slate-600 mb-2">Top schools by total {metric}</div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySchool.slice(0, 15)} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <XAxis dataKey="school" interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tickFormatter={(n) => (n >= 1000 ? `${Math.round(n/1000)}k` : `${n}`)} />
                  <Tooltip formatter={(v) => fmt.format(v)} />
                  <Bar dataKey="total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent></Card>
        )}

        {/* Mix */}
        {tab === "mix" && (
          <Card className="shadow-sm mt-4"><CardContent className="p-4">
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
                    <Tooltip formatter={(v) => fmt.format(v)} />
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
          </CardContent></Card>
        )}

        <footer className="text-xs text-slate-500 pt-6">
          Built with Next.js + Tailwind + Recharts. Data from <code>/public/data/sales_tidy.json</code>.
        </footer>
      </div>
    </div>
  );
}
