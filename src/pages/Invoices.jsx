// File: /src/pages/Invoices.jsx

import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AddInvoiceForm from "../components/AddInvoiceForm";

export default function Invoices() {
  const [invoices, setInvoices] = useLocalStorage("invoices", [
    {
      id: 1,
      supplier: "Alpha Textiles",
      amount: 5000,
      dueDate: "2025-08-10",
      status: "Unpaid",
    },
    {
      id: 2,
      supplier: "Beta Packaging",
      amount: 3200,
      dueDate: "2025-08-05",
      status: "Paid",
    },
  ]);

  const [filter, setFilter] = useState("All");

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === "All") return true;
    return inv.status === filter;
  });

  const toggleStatus = (id) => {
    const updated = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, status: inv.status === "Paid" ? "Unpaid" : "Paid" }
        : inv
    );
    setInvoices(updated);
  };

  const addInvoice = (newInvoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices & Payments</h1>

      {/* Add Invoice Form */}
      <AddInvoiceForm onAdd={addInvoice} />

      {/* Filter Dropdown */}
      <div className="mb-4 flex gap-4 items-center">
        <label className="text-sm font-semibold">Filter by Status:</label>
        <select
          className="border px-2 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="overflow-x-auto p-4">
          <table className="min-w-full border">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Supplier</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{invoice.supplier}</td>
                  <td className="p-2">${invoice.amount.toLocaleString()}</td>
                  <td className="p-2">{invoice.dueDate}</td>
                  <td className="p-2">
                    <span
                      className={
                        invoice.status === "Paid"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" onClick={() => toggleStatus(invoice.id)}>
                      Mark as {invoice.status === "Paid" ? "Unpaid" : "Paid"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteInvoice(invoice.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

