export function formatCurrency(value: number, currency: string = "AED") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value ?? 0);
}
