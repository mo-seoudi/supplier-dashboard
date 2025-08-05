import React, { useState } from "react";
import {
  academicYears,
  incomeTypes,
  schools,
  suppliers,
} from "@/data/config";

export default function Reports() {
  const [year, setYear] = useState("2024-2025");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [selectedIncomeType, setSelectedIncomeType] = useState("all");
  const [dataType, setDataType] = useState("sales"); // 'sales' | 'commission'
  const [comparison, setComparison] = useState("none"); // 'none' | 'growth' | 'forecast'

  const getFilteredData = () => {
    return suppliers
      .filter((supplier) => {
        const supplierMatch =
          selectedSupplier === "all" || supplier.id === selectedSupplier;
        const incomeMatch =
          selectedIncomeType === "all" ||
          supplier.incomeTypeId === selectedIncomeType;
        return supplierMatch && incomeMatch;
      })
      .flatMap((supplier) =>
        Object.entries(supplier.monthlyData || {}).map(([month, data]) => {
          if (selectedSchool !== "all" && data.school !== selectedSchool)
            return null;

          const value = dataType === "sales" ? data.sales : data.commission;
          const comparisonValue =
            comparison === "growth"
              ? ((data.sales - data.lastYear) / (data.lastYear || 1)) * 100
              : comparison === "forecast"
              ? ((data.sales - data.forecast) / (data.forecast || 1)) * 100
              : null;

          return {
            supplier: supplier.name,
            school: data.school,
            incomeType: incomeTypes.find((t) => t.id === supplier.incomeTypeId)
              ?.name,
            month,
            sales: data.sales,
            commission: data.commission,
            paid: data.paid,
            unpaid: data.unpaid,
            forecast: data.forecast,
            lastYear: data.lastYear,
            comparison: comparisonValue,
          };
        })
      )
      .filter(Boolean);
  };

  const rows = getFilteredData();

  // Summary values
  const totalSales = rows.reduce((sum, r) => sum + (r.sales || 0), 0);
  const totalCommission = rows.reduce((sum, r) => sum + (r.commission || 0), 0);
  const totalPaid = rows.reduce((sum, r) => sum + (r.paid || 0), 0);
  const totalUnpaid = rows.reduce((sum, r) => sum + (r.unpaid || 0), 0);
  const avgVariance =
    comparison !== "none"
      ? rows.reduce((sum, r) => sum + (r.comparison || 0), 0) /
        (rows.length || 1)
      : 0;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {academicYears.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}
            </option>
          ))}
        </select>

        <select
          value={selectedIncomeType}
          onChange={(e) => setSelectedIncomeType(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">All Income Types</option>
          {incomeTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">All Schools</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="sales">Sales</option>
          <option value="commission">Commission</option>
        </select>

        <select
          value={comparison}
          onChange={(e) => setComparison(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="none">No Comparison</option>
          <option value="growth">Vs Last Year</option>
          <option value="forecast">Vs Forecast</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-600">Total Sales</div>
          <div className="text-xl font-bold">${totalSales.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-600">Total Commission</div>
          <div className="text-xl font-bold">${totalCommission.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-600">Paid</div>
          <div className="text-xl font-bold text-green-700">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4">
          <div className="text-sm text-gray-600">Unpaid</div>
          <div className="text-xl font-bold text-red-600">${totalUnpaid.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow border rounded p-4 col-span-2 md:col-span-1">
          <div className="text-sm text-gray-600">Avg Variance</div>
          <div className="text-xl font-bold">
            {avgVariance.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Supplier</th>
              <th className="p-2 border">School</th>
              <th className="p-2 border">Income Type</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Sales</th>
              <th className="p-2 border">Commission</th>
              <th className="p-2 border">Paid</th>
              <th className="p-2 border">Unpaid</th>
              <th className="p-2 border">Forecast</th>
              <th className="p-2 border">Last Year</th>
              {comparison !== "none" && (
                <th className="p-2 border">Variance (%)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{r.supplier}</td>
                <td className="p-2 border">{r.school}</td>
                <td className="p-2 border">{r.incomeType}</td>
                <td className="p-2 border">{r.month}</td>
                <td className="p-2 border">${r.sales?.toLocaleString()}</td>
                <td className="p-2 border">${r.commission?.toLocaleString()}</td>
                <td className="p-2 border">${r.paid?.toLocaleString()}</td>
                <td className="p-2 border">${r.unpaid?.toLocaleString()}</td>
                <td className="p-2 border">${r.forecast?.toLocaleString()}</td>
                <td className="p-2 border">${r.lastYear?.toLocaleString()}</td>
                {comparison !== "none" && (
                  <td className="p-2 border">{r.comparison?.toFixed(1)}%</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
