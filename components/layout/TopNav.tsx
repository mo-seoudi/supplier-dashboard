'use client';
import Link from "next/link";
export default function TopNav() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="font-semibold"><Link href="/">Sales Dashboard</Link></div>
        <div className="text-sm text-gray-500">Interactive • Filters • Charts</div>
      </div>
    </header>
  );
}
