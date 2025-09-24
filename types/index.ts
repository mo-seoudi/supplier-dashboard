export type PeriodKey = `${number}-${"01"|"02"|"03"|"04"|"05"|"06"|"07"|"08"|"09"|"10"|"11"|"12"}`;

export interface SalesRow {
  schoolId: string;
  schoolName?: string;
  incomeTypeId: string;
  incomeTypeName?: string;
  month: PeriodKey;
  academicYear: string;
  actualSales: number;
  forecastSales: number;
  actualCommission: number;
  forecastCommission: number;
  currency: string;
  notes?: string;
}
