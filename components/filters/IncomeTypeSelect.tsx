'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function IncomeTypeSelect({ options }:{ options:{id:string; name:string}[] }){
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const current = params.get("types") ?? "";
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams(params.toString());
    const v = e.target.value; if (v) sp.set("types", v); else sp.delete("types");
    router.push(`${pathname}?${sp.toString()}`);
  };
  return (
    <label className="text-sm flex flex-col gap-1">
      <span className="text-gray-500">Income Type</span>
      <select value={current} onChange={onChange} className="border rounded-md px-2 py-1">
        <option value="">All income types</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </label>
  );
}
