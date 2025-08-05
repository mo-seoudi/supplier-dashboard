import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  schools,
  academicYears,
  incomeTypes,
  suppliers,
} from "@/data/config";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [year, setYear] = useState("2024-2025");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [selectedIncomeType, setSelectedIncomeType] = useState("all");
  const [dataType, setDataType] = useState("sales"); // or 'commission'
  const [comparison, setComparison] = useState("none"); // 'none' | 'growth' | 'forecast'

  const getFilteredSuppliers = () => {
    return suppliers.filter((supplier) => {
      const matchesSupplier =
        selectedSupplier === "all" || supplier.id === selectedSupplier;
      const matchesIncomeType =
        selectedIncomeType === "all" ||
        supplier.incomeTypeId === selectedIncomeType;
      return matchesSupplier && matchesIncomeType;
    });
  };

  const renderTableRows = () => {
    const rows = [];

    getFilteredSuppliers().forEach((supplier) => {
      const { name, monthlyData } = supplier;

      Object.entries(monthlyData || {}).forEach(([month, data]) => {
        if (selectedSchool !== "all" && data.school !== selectedSchool) return;

        const value = dataType === "sales" ? data.sales : data.commission;
        const comparisonValue =
          comparison === "growth"
            ? ((data.sales - data.lastYear) / (data.lastYear || 1)) * 100
            : comparison === "forecast"
            ? ((data.sales - data.forecast) / (data.forecast || 1)) * 100
            : null;

        rows.push({
          supplier: name,
          month,
          school: data.school.toUpperCase(),
          value,
          paid: data.paid,
          unpaid: data.unpaid,
          cumulative: value + (dataType === "sales" ? data.paid : 0),
          comparison: comparisonValue,
          dataType,
        });
      });
    });

    return rows;
  };

  const generateChartData = () => {
    const monthlySummary = {};

    getFilteredSuppliers().forEach((supplier) => {
      Object.entries(supplier.monthlyData || {}).forEach(([month, data]) => {
        if (selectedSchool !== "all" && data.school !== selectedSchool) return;

        if (!monthlySummary[month]) {
          monthlySummary[month] = {
            month,
            value: 0,
            forecast: 0,
            lastYear: 0,
          };
        }

        monthlySummary[month].value +=
          dataType === "sales" ? data.sales : data.commission;
        monthlySummary[month].forecast += data.forecast || 0;
        monthlySummary[month].lastYear += data.lastYear || 0;
      });
    });

    return Object.values(monthlySummary).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  };

  // KPI Summary
  const kpiRows = renderTableRows();
  const totalSales = kpiRows.reduce((sum, row) => sum + (row.value || 0), 0);
  const totalCommission = kpiRows.reduce(
    (sum, row) => sum + (row.dataType === "commission" ? row.value : 0),
    0
  );
  const totalPaid = kpiRows.reduce((sum, row) => sum + (row.paid || 0), 0);
  const totalUnpaid = kpiRows.reduce((sum, row) => sum + (row.unpaid || 0), 0);
  const avgVariance =
    comparison !== "none"
      ? kpiRows.reduce((sum, row) => sum + (row.comparison || 0), 0) /
        (kpiRows.length || 1)
      : 0;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="border px-2 py-1">
          {academicYears.map((y) => (
            <option key={y.id} value={y.id}>{y.name}</option>
          ))}
        </select>

        <select value={selectedIncomeType} onChange={(e) => setSelectedIncomeType(e.target.value)} className="border px-2 py-1">
          <option value="all">All Income Types</option>
          {incomeTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} className="border px-2 py-1">
          <option value="all">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="border px-2 py-1">
          <option value="all">All Schools</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>

        <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="border px-2 py-1">
          <option value="sales">Sales</option>
          <option value="commission">Commission</option>
        </select>

        <select value={comparison} onChange={(e) => setComparison(e.target.value)} className="border px-2 py-1">
          <option value="none">No Comparison</option>
          <option value="growth">YoY Growth</option>
          <option value="forecast">Vs Forecast</option>
        </select>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-xl font-bold">${totalSales.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-500">Total Commission</div>
          <div className="text-xl font-bold">${totalCommission.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-500">Paid</div>
          <div className="text-xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-500">Unpaid</div>
          <div className="text-xl font-bold text-red-600">${totalUnpaid.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4 col-span-2 md:col-span-1">
          <div className="text-sm text-gray-500">Avg Forecast Variance</div>
          <div className="text-xl font-bold">
            {avgVariance > 0 ? "+" : ""}
            {avgVariance.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">School</th>
                <th className="p-2 border capitalize">{dataType}</th>
                <th className="p-2 border">Paid</th>
                <th className="p-2 border">Unpaid</th>
                <th className="p-2 border">Cumulative</th>
                {comparison !== "none" && <th className="p-2 border">Comparison (%)</th>}
              </tr>
            </thead>
            <tbody>
              {kpiRows.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{row.supplier}</td>
                  <td className="p-2 border">{row.month}</td>
                  <td className="p-2 border">{row.school}</td>
                  <td className="p-2 border">${row.value.toLocaleString()}</td>
                  <td className="p-2 border">${row.paid.toLocaleString()}</td>
                  <td className="p-2 border">${row.unpaid.toLocaleString()}</td>
                  <td className="p-2 border">${row.cumulative.toLocaleString()}</td>
                  {comparison !== "none" && (
                    <td className="p-2 border">{row.comparison?.toFixed(1)}%</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            Monthly {dataType === "sales" ? "Sales" : "Commission"} Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Actual" />
              {comparison === "forecast" && (
                <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast" />
              )}
              {comparison === "growth" && (
                <Line type="monotone" dataKey="lastYear" stroke="#ffc658" name="Last Year" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
