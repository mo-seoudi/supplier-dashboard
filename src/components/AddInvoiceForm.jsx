// File: /src/components/AddInvoiceForm.jsx

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddInvoiceForm({ onAdd }) {
  const [supplier, setSupplier] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplier || !amount || !dueDate) return;

    const newInvoice = {
      id: Date.now(),
      supplier,
      amount: parseFloat(amount),
      dueDate,
      status: "Unpaid",
    };

    onAdd(newInvoice);
    setSupplier("");
    setAmount("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <Button type="submit">Add Invoice</Button>
    </form>
  );
}