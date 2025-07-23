import { invoke } from "@tauri-apps/api/core";
import { useAtomValue, useSetAtom } from "jotai";
import { filePath, sheetSelected, tableData } from "./state";
import { TableDataType } from "./dto";

/**
 * Custom hook for loading table data from an Excel sheet
 *
 * @returns {Function} An async function that loads table data from the currently selected file and sheet
 *
 * @example
 * // Usage in component:
 * const loadTable = useTableOpen();
 *
 * <button onClick={loadTable}>Load Table Data</button>
 *
 * @description
 * This hook:
 * 1. Uses the current file path and selected sheet from Jotai state
 * 2. Calls Rust backend to load and parse the Excel data
 * 3. Updates the table data in global state
 *
 * @throws {Error} Logs errors to console if data loading fails
 */
export const useTableOpen = () => {
  const url = useAtomValue(filePath);
  const sheet = useAtomValue(sheetSelected);
  const setData = useSetAtom(tableData);

  return async () => {
    try {
      // Call Rust backend to load data
      const data = await invoke<TableDataType>("load_data", {
        url: url,
        sheetName: sheet,
      });
      if (data.status === 200) {
        setData(data);
        return {
          status: 200,
          data: {
            headers: data.headers,
            rows: data.rows,
          },
        };
      }

      if (data.status === 404) {
        return {
          status: 404,
          error: data.error || "Sheet not found",
        };
      }

      return {
        status: data.status || 500,
        error: data.error || "Unknown error",
      };
    } catch (error) {
      console.error("Error loading table data:", error);
    }
  };
};
