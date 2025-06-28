import { atom, useAtomValue } from "jotai";
import { tableData } from "../data/state";
import { atomFamily } from 'jotai/utils'
import { useColumnShow } from "./GetColumn";

export const columnPickSheetVertices = atomFamily((columnName: string) => {
  return atom((get) => {
    const data = get(tableData);
    if (!data || !columnName) return null;
    
    // Filter out null/undefined values if needed
    const columnValues = data.rows.map(row => row[columnName]).filter(Boolean);
    
    console.log(`Column "${columnName}" data:`, columnValues);
    return columnValues;
  });
});

export const useColumnData = (columnName: string) => {
  const data = useAtomValue(tableData);
  return data?.rows.map(row => row[columnName]) || null;
};

// export const vertex1ColumnData = atom((get) => {
//   const data = get(tableData);
//   const column = get(vertex2ColumnSelected);
//   return data?.rows.map(row => row[column]) || null;
// });

// export const vertex2ColumnData = atom((get) => {
//   const data = get(tableData);
//   const column = get(vertex2Column);
//   return data?.rows.map(row => row[column]) || null;
// });