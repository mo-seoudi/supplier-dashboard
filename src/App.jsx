// File: /src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Invoices from "./pages/Invoices";
import Contracts from "./pages/Contracts";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-gray-800 text-white px-4 py-3 flex gap-4">
          <Link to="/" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/suppliers" className="hover:underline">
            Suppliers
          </Link>
          <Link to="/invoices" className="hover:underline">
            Invoices
          </Link>
          <Link to="/contracts" className="hover:underline">
            Contracts
          </Link>
          <Link to="/reports" className="hover:underline">
            Reports
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}
