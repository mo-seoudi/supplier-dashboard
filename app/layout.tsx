import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";
export const metadata: Metadata = { title: "Sales Dashboard", description: "Interactive sales dashboard" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <div className="mx-auto max-w-7xl px-4 py-6 flex gap-6">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
