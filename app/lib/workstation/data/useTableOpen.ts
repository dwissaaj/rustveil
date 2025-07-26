import { invoke } from "@tauri-apps/api/core";
import { useAtomValue, useSetAtom } from "jotai";
import { filePath, sheetSelected, tableData } from "./state";
import { TableDataType } from "./dto";

export const useTableOpen = () => {
  const { isSelected, url } = useAtomValue(filePath);
  const sheet = useAtomValue(sheetSelected);
  const setData = useSetAtom(tableData);

  return async () => {
    try {
      // Call Rust backend to load data
      const data = await invoke<TableDataType>("load_data", {
        url: url,
        sheetName: sheet,
      });
      console.log(data);
      if (data.response_code === 200) {
        setData(data);
        return {
          response_code: 200,
          message: "Good",
        };
      }

      if (data.response_code === 404) {
        return {
          response_code: 404,
          message: "Sheet not found",
        };
      }

      return {
        status: data.response_code,
        error: data.message || "Unknown error",
      };
    } catch (error) {
      console.error("Error loading table data:", error);
    }
  };
};
