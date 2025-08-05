import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  schools as initialSchools,
  academicYears as initialYears,
  incomeTypes as initialIncomeTypes,
  suppliers as initialSuppliers,
} from "../data/config";

export default function AdminPanel() {
  const [schools, setSchools] = useState(initialSchools);
  const [years, setYears] = useState(initialYears);
  const [incomeTypes, setIncomeTypes] = useState(initialIncomeTypes);
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  const [newSchool, setNewSchool] = useState("");
  const [newYear, setNewYear] = useState({ id: "", name: "", start: "", end: "" });
  const [newIncomeType, setNewIncomeType] = useState("");
  const [newSupplier, setNewSupplier] = useState({ name: "", incomeTypeId: "" });

  const addSchool = () => {
    setSchools([...schools, { id: newSchool.toLowerCase(), name: newSchool, startMonth: 8 }]);
    setNewSchool("");
  };

  const addYear = () => {
    setYears([...years, newYear]);
    setNewYear({ id: "", name: "", start: "", end: "" });
  };

  const addIncomeType = () => {
    setIncomeTypes([...incomeTypes, { id: newIncomeType.toLowerCase(), name: newIncomeType }]);
    setNewIncomeType("");
  };

  const addSupplier = () => {
    const id = newSupplier.name.toLowerCase().replace(/\s+/g, "-");
    setSuppliers([
      ...suppliers,
      { id, name: newSupplier.name, incomeTypeId: newSupplier.incomeTypeId, monthlyData: {} },
    ]);
    setNewSupplier({ name: "", incomeTypeId: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Add School */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Add New School</h2>
          <input
            value={newSchool}
            onChange={(e) => setNewSchool(e.target.value)}
            placeholder="School Name"
            className="border px-2 py-1"
          />
          <button onClick={addSchool} className="bg-blue-600 text-white px-4 py-1 rounded">Add School</button>
        </CardContent>
      </Card>

      {/* Add Academic Year */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Add Academic Year</h2>
          <input
            value={newYear.id}
            onChange={(e) => setNewYear({ ...newYear, id: e.target.value })}
            placeholder="ID (e.g. 2025-2026)"
            className="border px-2 py-1"
          />
          <input
            value={newYear.name}
            onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
            placeholder="Name (e.g. AY 25-26)"
            className="border px-2 py-1"
          />
          <input
            value={newYear.start}
            onChange={(e) => setNewYear({ ...newYear, start: e.target.value })}
            placeholder="Start Date (yyyy-mm-dd)"
            className="border px-2 py-1"
          />
          <input
            value={newYear.end}
            onChange={(e) => setNewYear({ ...newYear, end: e.target.value })}
            placeholder="End Date (yyyy-mm-dd)"
            className="border px-2 py-1"
          />
          <button onClick={addYear} className="bg-blue-600 text-white px-4 py-1 rounded">Add Year</button>
        </CardContent>
      </Card>

      {/* Add Income Type */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Add Income Type</h2>
          <input
            value={newIncomeType}
            onChange={(e) => setNewIncomeType(e.target.value)}
            placeholder="Income Type"
            className="border px-2 py-1"
          />
          <button onClick={addIncomeType} className="bg-blue-600 text-white px-4 py-1 rounded">Add Type</button>
        </CardContent>
      </Card>

      {/* Add Supplier */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Add Supplier</h2>
          <input
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            placeholder="Supplier Name"
            className="border px-2 py-1"
          />
          <select
            value={newSupplier.incomeTypeId}
            onChange={(e) => setNewSupplier({ ...newSupplier, incomeTypeId: e.target.value })}
            className="border px-2 py-1"
          >
            <option value="">Select Income Type</option>
            {incomeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <button onClick={addSupplier} className="bg-blue-600 text-white px-4 py-1 rounded">Add Supplier</button>
        </CardContent>
      </Card>
    </div>
  );
}

