import type { SalesRow } from "../types";
export const sumBy = <T,>(rows: T[], pick: (x: T) => number) => rows.reduce((a, r) => a + (Number(pick(r)) || 0), 0);
