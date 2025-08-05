// File: /src/pages/Suppliers.jsx

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useLocalStorage("suppliers", []);
  const [editingId, setEditingId] = useState(null);
  const [month, setMonth] = useState("");
  const [sales, setSales] = useState("");
  const [commission, setCommission] = useState("");

  const handleEdit = (supplierId) => {
    if (editingId === supplierId) {
      setEditingId(null);
      setMonth("");
      setSales("");
      setCommission("");
    } else {
      setEditingId(supplierId);
    }
  };

  const handleSubmit = (e, supplierId) => {
    e.preventDefault();
    if (!month || !sales || !commission) return;

    const updated = suppliers.map((supplier) => {
      if (supplier.id === supplierId) {
        return {
          ...supplier,
          monthlyData: {
            ...(supplier.monthlyData || {}),
            [month]: {
              sales: parseFloat(sales),
              commission: parseFloat(commission),
            },
          },
        };
      }
      return supplier;
    });

    setSuppliers(updated);
    setEditingId(null);
    setMonth("");
    setSales("");
    setCommission("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers Directory</h1>
      <Card>
        <CardContent className="overflow-x-auto p-4">
          <table className="min-w-full border">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Category</th>
                <th className="p-2">Since</th>
                <th className="p-2">Total Sales</th>
                <th className="p-2">Total Commission</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => {
                const totalSales = Object.values(supplier.monthlyData || {}).reduce(
                  (sum, m) => sum + (m.sales || 0),
                  0
                );
                const totalCommission = Object.values(supplier.monthlyData || {}).reduce(
                  (sum, m) => sum + (m.commission || 0),
                  0
                );

                return (
                  <React.Fragment key={supplier.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{supplier.name}</td>
                      <td className="p-2">{supplier.contact}</td>
                      <td className="p-2">{supplier.category}</td>
                      <td className="p-2">{supplier.since}</td>
                      <td className="p-2">${totalSales.toLocaleString()}</td>
                      <td className="p-2">${totalCommission.toLocaleString()}</td>
                      <td className="p-2">
                        <Button size="sm" onClick={() => handleEdit(supplier.id)}>
                          {editingId === supplier.id ? "Cancel" : "Edit Monthly Data"}
                        </Button>
                      </td>
                    </tr>

                    {editingId === supplier.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="7">
                          <form
                            onSubmit={(e) => handleSubmit(e, supplier.id)}
                            className="flex flex-col md:flex-row gap-4 p-4 items-center"
                          >
                            <Input
                              type="month"
                              value={month}
                              onChange={(e) => setMonth(e.target.value)}
                              required
                              className="w-40"
                            />
                            <Input
                              type="number"
                              placeholder="Sales"
                              value={sales}
                              onChange={(e) => setSales(e.target.value)}
                              required
                              className="w-32"
                            />
                            <Input
                              type="number"
                              placeholder="Commission"
                              value={commission}
                              onChange={(e) => setCommission(e.target.value)}
                              required
                              className="w-32"
                            />
                            <Button type="submit">Save</Button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
