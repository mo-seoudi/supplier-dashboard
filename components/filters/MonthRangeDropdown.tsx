'use client';
import { monthsForAY } from "../../utils/date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";

function fmt(m: string) {
  // input "YYYY-MM" -> "Mmm-yy"
  const [y, mm] = m.split("-").map(Number);
  const d = new Date(y, mm - 1, 1);
  const mon = d.toLocaleString(undefined, { month: "short" });
  return `${mon}-${String(y).slice(-2)}`;
}

export default function MonthRangeDropdown({ ay }: { ay?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const months = useMemo(() => (ay ? monthsForAY(ay) : []), [ay]);

  const current = params.get("months") || "";
  const [start, end] = current.includes("..") ? current.split("..") : ["", ""];
  const sIdx = months.indexOf(start);
  const eIdx = months.indexOf(end);

  const hasAY = Boolean(ay && months.length);

  function setRange(s: string, e: string) {
    const sp = new URLSearchParams(params.toString());
    if (!s && !e) sp.delete("months");
    else sp.set("months", `${s}..${e}`);
    router.push(`${pathname}?${sp.toString()}`);
  }

  function handlePick(m: string) {
    if (!start || (start && end)) {
      // start new selection
      setRange(m, m);
    } else {
      // set end; ensure ordering
      const s = months.indexOf(start);
      const e = months.indexOf(m);
      if (s === -1 || e === -1) return;
      if (e < s) setRange(m, start);
      else setRange(start, m);
    }
  }

  function clear() {
    setRange("", "");
  }

  const label =
    hasAY && start && end ? `${fmt(start)} → ${fmt(end)}` : hasAY ? "All months" : "Select AY first";

  return (
    <div className="text-sm relative" ref={wrapperRef}>
      <span className="text-gray-500 block mb-1">Month range</span>

      <button
        type="button"
        onClick={() => hasAY && setOpen((v) => !v)}
        className={`w-full border rounded-md px-3 py-2 text-left ${
          hasAY ? "hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={!hasAY}
      >
        {label}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 w-[22rem] rounded-xl border bg-white shadow-lg p-3"
        >
          <div className="grid gap-2"
               style={{ gridTemplateColumns: `repeat(4, minmax(0,1fr))` }}>
            {months.map((m, i) => {
              const inSel = sIdx !== -1 && eIdx !== -1 && i >= sIdx && i <= eIdx;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handlePick(m)}
                  className={`rounded-md border px-2 py-1 text-left transition ${
                    inSel ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-100"
                  }`}
                >
                  {fmt(m)}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {start && end ? `Selected: ${fmt(start)} → ${fmt(end)}` : "Pick a start month, then an end month"}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clear}
                className="text-xs px-2 py-1 underline text-gray-600"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs px-3 py-1 rounded-md border hover:bg-gray-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
