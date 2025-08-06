
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

  const [newIncomeType, setNewIncomeType] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [newSupplierIncomeTypeId, setNewSupplierIncomeTypeId] = useState(incomeTypes[0]?.id || "");

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

  const handleAddIncomeType = () => {
    if (!newIncomeType.trim()) return;
    console.log("Added Income Type:", newIncomeType);
    alert(`Added income type: ${newIncomeType}`);
    setNewIncomeType("");
  };

  const handleAddSchool = () => {
    if (!newSchool.trim()) return;
    console.log("Added School:", newSchool);
    alert(`Added school: ${newSchool}`);
    setNewSchool("");
  };

  const handleAddSupplier = () => {
    if (!newSupplier.trim() || !newSupplierIncomeTypeId) return;
    console.log("Added Supplier:", newSupplier, "linked to", newSupplierIncomeTypeId);
    alert(`Added supplier: ${newSupplier}`);
    setNewSupplier("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel: Monthly Data Entry</h1>

      {/* Manual Entry Form */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label>
          Supplier
          <select name="supplierId" value={form.supplierId} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label>
          School
          <select name="schoolId" value={form.schoolId} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label>
          Income Type
          <select name="incomeTypeId" value={form.incomeTypeId} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
            {incomeTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <label>
          Academic Year
          <select name="year" value={form.year} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
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

      <div className="mt-4 flex gap-4">
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

      {/* Section: Add Master Data */}
      <h2 className="text-xl font-semibold mt-8">Add New Master Data</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Income Type */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">New Income Type</label>
          <input type="text" value={newIncomeType} onChange={(e) => setNewIncomeType(e.target.value)} className="border p-2 rounded" />
          <button onClick={handleAddIncomeType} className="bg-blue-500 text-white px-2 py-1 mt-1 rounded">Add</button>
        </div>

        {/* School */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">New School</label>
          <input type="text" value={newSchool} onChange={(e) => setNewSchool(e.target.value)} className="border p-2 rounded" />
          <button onClick={handleAddSchool} className="bg-blue-500 text-white px-2 py-1 mt-1 rounded">Add</button>
        </div>

        {/* Supplier */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">New Supplier</label>
          <input type="text" value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)} className="border p-2 rounded" />
          <select value={newSupplierIncomeTypeId} onChange={(e) => setNewSupplierIncomeTypeId(e.target.value)} className="border mt-1 p-2 rounded">
            {incomeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <button onClick={handleAddSupplier} className="bg-blue-500 text-white px-2 py-1 mt-1 rounded">Add</button>
        </div>
      </div>
    </div>
  );
}
