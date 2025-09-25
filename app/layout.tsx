import "./globals.css";
import type { Metadata } from "next";
import TopNav from "../components/layout/TopNav";
export const metadata: Metadata = { title: "Sales Dashboard", description: "Overview" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
