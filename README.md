# Sales Dashboard Starter (Next.js + TS + Tailwind)

Minimal frontend-only dashboard that reads `public/data/sales.json` (monthly grain) and renders:
- KPIs: total actual, total forecast, variance (% diff)
- Table: School × Income Type × Month with actual vs forecast

## Quick start
```bash
pnpm i    # or: npm i  /  yarn
pnpm dev  # http://localhost:3000
```

## Monthly update workflow
1) Replace `public/data/sales.json` with your latest dataset.
2) Commit & push to GitHub.
3) Vercel auto-deploys.

## Data shape (one row per school × income type × month)
```json
{
  "schoolId": "SCH-001",
  "schoolName": "Greenfield School",
  "incomeTypeId": "CAT",
  "incomeTypeName": "Catering",
  "month": "2024-09",
  "academicYear": "2024-2025",
  "actualSales": 125000,
  "forecastSales": 120000,
  "actualCommission": 12500,
  "forecastCommission": 12000,
  "currency": "AED",
  "notes": ""
}
```

> Need Excel → JSON? Convert locally and overwrite `public/data/sales.json`.

## Next steps
- Add per-school route at `app/school/[schoolId]/page.tsx`
- Add charts under `components/charts/*`
- Add filters under `components/filters/*`
- Keep all math in `lib/metrics.ts`
