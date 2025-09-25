'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { monthsForAY } from "../../utils/date";

function fmt(m: string) {
  // "YYYY-MM" -> "Mmm-YYYY" e.g., "Sep-2025"
  const [y, mm] = m.split("-").map(Number);
  const d = new Date(y, mm - 1, 1);
  const mon = d.toLocaleString(undefined, { month: "short" });
  return `${mon}-${y}`;
}

export default function MonthSelect({ ay }: { ay?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const months = ay ? monthsForAY(ay) : [];

  // read current months=YYYY-MM..YYYY-MM (or empty)
  const raw = params.get("months") || "";
  const selected = raw.includes("..") ? raw.split("..")[0] : ""; // store single month

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    const sp = new URLSearchParams(params.toString());
    if (!v) sp.delete("months");               // "All months"
    else sp.set("months", `${v}..${v}`);       // single month encoded as range
    router.push(`${pathname}?${sp.toString()}`);
  };

  const disabled = !ay || months.length === 0;

  return (
    <label className="text-sm flex flex-col gap-1">
      <span className="text-gray-500">Select Month</span>
      <select
        value={selected && months.includes(selected) ? selected : ""}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded-md px-2 py-1 ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
      >
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>{fmt(m)}</option>
        ))}
      </select>
    </label>
  );
}
