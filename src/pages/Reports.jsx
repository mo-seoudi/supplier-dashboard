// File: /src/pages/Reports.jsx

import React, { useState } from "react";
import { suppliers, incomeTypes, schools, academicYears } from "../data/config";

export default function Reports() {
  const [year, setYear] = useState(academicYears[0]);

  const getMonthlyData = () => {
    const result = [];

    suppliers.forEach((supplier) => {
      const dataByYear = supplier.data[year];
      if (!dataByYear) return;

      Object.entries(dataByYear).forEach(([month, entries]) => {
        entries.forEach((entry) => {
          const income = incomeTypes.find((i) => i.id === entry.incomeTypeId)?.name || "";
          const school = schools.find((s) => s.id === entry.schoolId)?.name || "";

          result.push({
            supplier: supplier.name,
            month,
            school,
            incomeType: income,
            sales: entry.sales,
            commission: entry.commission,
            paid: entry.paid,
            forecast: entry.forecast,
            lastYear: entry.lastYear,
          });
        });
      });
    });

    return result;
  };

  const data = getMonthlyData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supplier Monthly Report</h1>

      <label className="block mb-4">
        Academic Year:
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          {academicYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Supplier</th>
            <th className="border p-2">School</th>
            <th className="border p-2">Income Type</th>
            <th className="border p-2">Month</th>
            <th className="border p-2">Sales</th>
            <th className="border p-2">Commission</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Forecast</th>
            <th className="border p-2">Last Year</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="border p-2">{row.supplier}</td>
              <td className="border p-2">{row.school}</td>
              <td className="border p-2">{row.incomeType}</td>
              <td className="border p-2">{row.month}</td>
              <td className="border p-2">{row.sales}</td>
              <td className="border p-2">{row.commission}</td>
              <td className="border p-2">{row.paid}</td>
              <td className="border p-2">{row.forecast}</td>
              <td className="border p-2">{row.lastYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
