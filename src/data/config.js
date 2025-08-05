// File: /src/data/config.js

export const schools = [
  { id: "rose", name: "ROSE", startMonth: 8 },
  { id: "rdxb", name: "RDXB", startMonth: 8 },
  { id: "rab", name: "RAB", startMonth: 8 },
];

export const academicYears = [
  { id: "2023-2024", name: "AY 23-24", start: "2023-08-01", end: "2024-07-31" },
  { id: "2024-2025", name: "AY 24-25", start: "2024-08-01", end: "2025-07-31" },
];

export const incomeTypes = [
  { id: "uniform", name: "Uniform", suppliers: ["alpha-textiles", "beta-fabrics"] },
  { id: "catering", name: "Catering", suppliers: ["gamma-catering"] },
];

export const suppliers = [
  {
    id: "alpha-textiles",
    name: "Alpha Textiles",
    incomeTypeId: "uniform",
    monthlyData: {
      "2025-07": {
        school: "rose",
        sales: 12000,
        commission: 1800,
        paid: 11000,
        unpaid: 1000,
        forecast: 11500,
        lastYear: 10200,
      },
    },
  },
  {
    id: "beta-fabrics",
    name: "Beta Fabrics",
    incomeTypeId: "uniform",
    monthlyData: {},
  },
  {
    id: "gamma-catering",
    name: "Gamma Catering",
    incomeTypeId: "catering",
    monthlyData: {
      "2025-07": {
        school: "rdxb",
        sales: 15000,
        commission: 2000,
        paid: 14000,
        unpaid: 1000,
        forecast: 16000,
        lastYear: 14500,
      },
    },
  },
];
