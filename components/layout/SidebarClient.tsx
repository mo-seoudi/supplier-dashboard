'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

type TypeOpt = { id: string; name: string };

export default function SidebarClient({ types }: { types: TypeOpt[] }) {
  const pathname = usePathname();
  const [typesOpen, setTypesOpen] = useState(true);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm ${
        isActive(href) ? "bg-gray-900 text-white" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );

  // Keep the list stable & readable
  const sorted = useMemo(
    () => [...types].sort((a, b) => a.name.localeCompare(b.name)),
    [types]
  );

  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-4 text-lg font-semibold">Menu</div>
      <nav className="px-2 pb-4 space-y-1">
        {navItem("/", "Overview")}

        {/* Income Types group */}
        <button
          type="button"
          onClick={() => setTypesOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          <span>Income Types</span>
          <span className="text-gray-500">{typesOpen ? "–" : "+"}</span>
        </button>
        {typesOpen && (
          <div className="ml-2 border-l">
            <div className="pl-3 py-1 space-y-1">
              {sorted.length === 0 && (
                <div className="px-2 py-1 text-xs text-gray-500">
                  No income types found
                </div>
              )}
              {sorted.map((t) => (
                <Link
                  key={t.id}
                  href={`/income/${encodeURIComponent(t.id)}`}
                  className={`block rounded-md px-2 py-1 text-sm ${
                    isActive(`/income/${t.id}`)
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {navItem("/growth", "Growth")}
        {navItem("/actual-forecast", "Actual vs. Forecast")}
      </nav>
    </aside>
  );
}
