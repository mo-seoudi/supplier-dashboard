import "./globals.css";
import type { Metadata } from "next";
import TopNav from "../components/layout/TopNav";
import SidebarClient from "../components/layout/SidebarClient";
import { getRows, getOptions } from "../lib/data";

export const metadata: Metadata = {
  title: "Sales Dashboard",
  description: "Overview",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Server-side: read data once, pass income types into the client sidebar
  const rows = getRows();
  const { types } = getOptions(rows); // [{ id, name }]

  return (
    <html lang="en">
      <body>
        <TopNav />
        <div className="mx-auto max-w-7xl px-4 py-6 flex gap-6">
          <SidebarClient types={types} />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
