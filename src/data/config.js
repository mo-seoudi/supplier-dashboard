// File: /src/data/config.js

export const incomeTypes = [
  { id: "catering", name: "Catering" },
  { id: "uniform", name: "Uniform" },
  { id: "canteen", name: "Canteen" },
];

export const schools = [
  { id: "rdxb", name: "RDXB" },
  { id: "rdxd", name: "RDXD" },
];

export const academicYears = ["2023-2024", "2024-2025"];

export const suppliers = [
  {
    id: "gamma-catering",
    name: "Gamma Catering",
    incomeTypeId: "catering",
    data: {
      "2024-2025": {
        "2025-07": [
          {
            schoolId: "rdxb",
            incomeTypeId: "catering",
            sales: 15000,
            commission: 1000,
            paid: 14000,
            forecast: 16000,
            lastYear: 12000,
          },
          {
            schoolId: "rdxd",
            incomeTypeId: "catering",
            sales: 8000,
            commission: 400,
            paid: 8000,
            forecast: 9000,
            lastYear: 7000,
          },
        ],
        "2025-08": [
          {
            schoolId: "rdxb",
            incomeTypeId: "uniform",
            sales: 5000,
            commission: 250,
            paid: 4000,
            forecast: 6000,
            lastYear: 5500,
          },
        ],
      },
    },
  },
  {
    id: "alpha-uniform",
    name: "Alpha Uniforms",
    incomeTypeId: "uniform",
    data: {
      "2024-2025": {
        "2025-07": [
          {
            schoolId: "rdxb",
            incomeTypeId: "uniform",
            sales: 7000,
            commission: 350,
            paid: 6500,
            forecast: 8000,
            lastYear: 6000,
          },
        ],
      },
    },
  },
];
