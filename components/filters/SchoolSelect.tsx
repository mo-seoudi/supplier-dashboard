'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function SchoolSelect({ options }:{ options:{id:string; name:string}[] }){
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const current = params.get("school") ?? "";
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams(params.toString());
    const v = e.target.value; if (v) sp.set("school", v); else sp.delete("school");
    router.push(`${pathname}?${sp.toString()}`);
  };
  return (
    <label className="text-sm flex flex-col gap-1">
      <span className="text-gray-500">School</span>
      <select value={current} onChange={onChange} className="border rounded-md px-2 py-1">
        <option value="">All schools</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </label>
  );
}
