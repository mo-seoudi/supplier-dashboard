// File: /src/pages/Contracts.jsx

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Contracts() {
  const [contracts, setContracts] = useLocalStorage("contracts", []);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = () => {
    if (!selectedFile) return;

    const newContract = {
      id: Date.now(),
      name: selectedFile.name,
      date: new Date().toISOString().split("T")[0],
    };

    setContracts([newContract, ...contracts]);
    setSelectedFile(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contracts</h1>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <Input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full md:w-auto"
          />
          <Button onClick={handleUpload}>Upload Contract</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <table className="min-w-full border">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">File Name</th>
                <th className="p-2">Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{contract.name}</td>
                  <td className="p-2">{contract.date}</td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan="2" className="p-2 text-center text-gray-500">
                    No contracts uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
