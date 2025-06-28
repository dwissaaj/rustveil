import { atom } from "jotai";
import { tableData } from "../data/state";

// export const getColumnValue = async (sheetSelect: string) => {
//     try {
//         atom((get) => {
//             const data = get(tableData)
//         })
//     } catch (error) {
//         console.log("Error at get column value")
//     }
// }

export const getColumnValuesAtom = atom((get) => {
  const data = get(tableData);
  if (!data) return null;

  // Replace "sentiment_label" with your target column
  const columnName = "sentiment_label";

  // Extract all values from the column
  const columnValues = data.rows.map((row) => row[columnName]);

  return columnValues;
});
