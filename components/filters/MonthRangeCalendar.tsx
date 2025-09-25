'use client';
import { monthsForAY } from "../../utils/date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function MonthRangeCalendar({ ay }: { ay?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Guard: if no AY yet, no month grid to compute
  const months = useMemo(() => (ay ? monthsForAY(ay) : []), [ay]);
  const current = params.get("months") || "";
  const [start, end] = current.includes("..") ? current.split("..") : ["", ""];

  function setRange(s: string, e: string) {
    const sp = new URLSearchParams(params.toString());
    if (!s && !e) sp.delete("months");
    else sp.set("months", `${s}..${e}`);
    router.push(`${pathname}?${sp.toString()}`);
  }

  function handlePick(m: string) {
    if (!start || (start && end)) {
      setRange(m, m);
    } else {
      const sIdx = months.indexOf(start);
      const mIdx = months.indexOf(m);
      if (sIdx === -1 || mIdx === -1) return;
      if (mIdx < sIdx) setRange(m, start);
      else setRange(start, m);
    }
  }

  function clear() {
    setRange("", "");
  }

  if (!ay || months.length === 0) {
    return (
      <div className="text-sm">
        <div className="text-gray-500 mb-1">Month range</div>
        <div className="text-xs text-gray-500">Select an Academic Year first.</div>
      </div>
    );
  }

  const sIdx = months.indexOf(start);
  const eIdx = months.indexOf(end);

  return (
    <div className="text-sm">
      <div className="text-gray-500 mb-1">Month range</div>
      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => {
          const selected = sIdx !== -1 && eIdx !== -1 && i >= sIdx && i <= eIdx;
          return (
            <button
              key={m}
              onClick={() => handlePick(m)}
              className={`rounded-md border px-2 py-1 text-left ${
                selected ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-100"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={clear} className="text-xs underline text-gray-600">
          Clear
        </button>
        {start && end && <span className="text-xs text-gray-500">Selected: {start} → {end}</span>}
      </div>
    </div>
  );
}
