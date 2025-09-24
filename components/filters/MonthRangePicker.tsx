'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
function monthsForAY(ay:string, ayStart=9){
  const [y1, y2] = ay.split("-").map(Number); const res:string[] = [];
  for(let m=ayStart;m<=12;m++) res.push(`${y1}-${String(m).padStart(2,"0")}`);
  for(let m=1;m<ayStart;m++) res.push(`${y2}-${String(m).padStart(2,"0")}`);
  return res;
}
export default function MonthRangePicker({ ay }:{ ay:string }){
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const list = monthsForAY(ay);
  const current = params.get("months") || ""; const [start, end] = current.includes("..") ? current.split("..") : ["",""];
  const onChange = (which:"start"|"end") => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams(params.toString()); const s = which==="start"? e.target.value : start; const t = which==="end"? e.target.value : end;
    if(!s && !t){ sp.delete("months"); } else { const val = `${s || list[0]}..${t || list[list.length-1]}`; sp.set("months", val); }
    router.push(`${pathname}?${sp.toString()}`);
  };
  return (
    <div className="text-sm flex flex-col gap-1">
      <span className="text-gray-500">Months (range)</span>
      <div className="flex gap-2">
        <select value={start} onChange={onChange("start")} className="border rounded-md px-2 py-1">
          <option value="">Start</option>
          {list.map(m=> <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={end} onChange={onChange("end")} className="border rounded-md px-2 py-1">
          <option value="">End</option>
          {list.map(m=> <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}
