// type for the data return from rust

// save at jotai state management
import { atom } from "jotai";

export type TableCell = string | number | boolean | null;

export interface TableDataType {
  headers: string[];
  rows: Record<string, TableCell>[];
}

export const tableDataAtom = atom<TableDataType | null>(null);
