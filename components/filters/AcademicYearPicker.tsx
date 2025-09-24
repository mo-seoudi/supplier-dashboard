'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function AcademicYearPicker({ options }:{ options:string[] }){
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const current = params.get("ay") ?? options[options.length - 1];
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams(params.toString()); sp.set("ay", e.target.value); router.push(`${pathname}?${sp.toString()}`);
  };
  return (
    <label className="text-sm flex flex-col gap-1">
      <span className="text-gray-500">Academic Year</span>
      <select value={current} onChange={onChange} className="border rounded-md px-2 py-1">{options.map(o=> <option key={o} value={o}>{o}</option>)}</select>
    </label>
  );
}
