// File: /src/pages/Dashboard.jsx

import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Dashboard Summary Cards */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-2xl">$150,000</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">Unpaid Invoices</h2>
          <p className="text-2xl">$25,000</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">YoY Growth</h2>
          <p className="text-2xl">+18%</p>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-wrap gap-4">
        <Button>Suppliers Directory</Button>
        <Button>Invoices & Payments</Button>
        <Button>Contracts</Button>
        <Button>Reports</Button>
      </div>
    </div>
  );

}
