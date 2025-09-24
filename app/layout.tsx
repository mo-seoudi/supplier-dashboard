import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Dashboard",
  description: "Simple sales dashboard (Actual vs Forecast)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="mx-auto max-w-6xl p-4 font-semibold">Sales Dashboard</div>
        </header>
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </body>
    </html>
  );
}
