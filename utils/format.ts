export function formatCurrency(value: number, currency: string = "AED") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value ?? 0);
}
export function formatPercent(value: number | null) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(value);
}
