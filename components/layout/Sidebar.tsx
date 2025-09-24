'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
const nav = [{ href: "/", label: "Overview" }, { href: "/compare", label: "Compare" }];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r bg-white">
      <div className="p-4 text-lg font-semibold">Menu</div>
      <nav className="px-2 pb-4 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href} className={`block rounded-md px-3 py-2 text-sm ${active ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`}>
              {n.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
