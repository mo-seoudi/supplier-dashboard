// File: /src/pages/Admin.jsx

import React, { useState } from "react";
import { suppliers, schools, incomeTypes, academicYears } from "../data/config";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Admin() {
  const [form, setForm] = useState({
    supplierId: suppliers[0]?.id || "",
    schoolId: schools[0]?.id || "",
    incomeTypeId: incomeTypes[0]?.id || "",
    year: academicYears[0] || "",
    month: "2025-08",
    sales: "",
    commission: "",
    paid: "",
    unpaid: "",
    forecast: "",
    lastYear: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Saved data:", form);
    alert("✅ Entry saved (mock only — not persisted)");
  };

  const handleCSVImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("❗ Please select a CSV file.");

    const text = await file.text();
    const rows = text
      .split("\n")
      .map((row) => row.split(","))
      .filter((row) => row.length > 5);

    const headers = rows.shift();

    const entries = rows.map((row) =>
      headers.reduce((obj, header, idx) => {
        obj[header.trim()] = row[idx]?.trim();
        return obj;
      }, {})
    );

    console.log("📦 Imported entries:", entries);
    alert(`📥 Imported ${entries.length} entries (mock only)`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel: Add Monthly Data</h1>

      {/* Manual Form */}
      <div className="grid grid-cols-2 gap-4">
        <label>
          Supplier
          <select
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label>
          School
          <select
            name="schoolId"
            value={form.schoolId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label>
          Income Type
          <select
            name="incomeTypeId"
            value={form.incomeTypeId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            {incomeTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <label>
          Academic Year
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            {academicYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <Input name="month" value={form.month} onChange={handleChange} placeholder="YYYY-MM" />
        <Input name="sales" value={form.sales} onChange={handleChange} placeholder="Sales" />
        <Input name="commission" value={form.commission} onChange={handleChange} placeholder="Commission" />
        <Input name="paid" value={form.paid} onChange={handleChange} placeholder="Paid" />
        <Input name="unpaid" value={form.unpaid} onChange={handleChange} placeholder="Unpaid" />
        <Input name="forecast" value={form.forecast} onChange={handleChange} placeholder="Forecast" />
        <Input name="lastYear" value={form.lastYear} onChange={handleChange} placeholder="Last Year" />
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit}>💾 Submit</Button>

        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm">📤 Import CSV:</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            className="block text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </label>
      </div>
    </div>
  );
}
