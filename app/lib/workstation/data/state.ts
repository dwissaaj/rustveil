import { atom } from "jotai";
import { TableDataType } from "./dto";

// for table data type
export const tableData = atom<TableDataType | null>(null);

// get all sheets from the file
export const sheetAvailable = atom<string[]>([]);

// single selected sheet to load
export const sheetSelected = atom<string>("");

// file path for the excel
export const filePath = atom<string>("");

export const columnAvailable = atom<string[]>([]);

export const vertex1ColumnSelected = atom<string>("");
export const vertex2ColumnSelected = atom<string>("");
export const vertex1AtomColumnData = atom<string | null>(null); // Your column selector
export const vertex2ColumnData = atom<string | null>(null);
