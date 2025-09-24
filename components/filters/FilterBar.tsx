'use client';
import AcademicYearPicker from "./AcademicYearPicker";
import SchoolSelect from "./SchoolSelect";
import IncomeTypeSelect from "./IncomeTypeSelect";
import MonthRangePicker from "./MonthRangePicker";
export default function FilterBar({ ays, schools, types, ay }:{ ays:string[]; schools:{id:string; name:string}[]; types:{id:string; name:string}[]; ay:string; }) {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AcademicYearPicker options={ays} />
        <SchoolSelect options={schools} />
        <IncomeTypeSelect options={types} />
        <MonthRangePicker ay={ay} />
      </div>
    </div>
  );
}
