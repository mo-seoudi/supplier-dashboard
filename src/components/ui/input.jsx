// File: /src/components/ui/input.jsx

import React from "react";

export function Input({ type = "text", value, onChange, placeholder = "", className = "", name }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
