// File: /src/pages/Admin.jsx

import React, { useState } from "react";
import { suppliers, schools, incomeTypes, academicYears } from "../data/config";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Admin() {
  const [form, setForm] = useState({
    supplierId: suppliers[0]?.id || "",
    schoolId: schools[0]?.id || "",
    incomeTypeId: incomeTypes[0]?.id || "",
    year: academicYears[0],
    month: "2025-07",
    sales: "",
    commission: "",
    paid: "",
    forecast: "",
    lastYear: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Data saved (this is just a placeholder, implement save logic)");
    console.log(form);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Monthly Sales & Commission</h2>

      <div className="grid grid-cols-2 gap-4">
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
            {incomeTypes.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
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

        <label>
          Month (YYYY-MM)
          <Input name="month" value={form.month} onChange={handleChange} placeholder="e.g. 2025-07" />
        </label>

        <label>
          Sales
          <Input name="sales" value={form.sales} onChange={handleChange} />
        </label>

        <label>
          Commission
          <Input name="commission" value={form.commission} onChange={handleChange} />
        </label>

        <label>
          Paid
          <Input name="paid" value={form.paid} onChange={handleChange} />
        </label>

        <label>
          Forecast
          <Input name="forecast" value={form.forecast} onChange={handleChange} />
        </label>

        <label>
          Last Year
          <Input name="lastYear" value={form.lastYear} onChange={handleChange} />
        </label>
      </div>

      <div className="mt-6">
        <Button onClick={handleSubmit}>Save Entry</Button>
      </div>
    </div>
  );
}
