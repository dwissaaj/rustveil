import { invoke } from "@tauri-apps/api/core";
import { useAtomValue, useSetAtom } from "jotai";
import { filePath, sheetSelected, tableData } from "./state";
import { TableDataType } from "./dto";

import { useCallback } from "react";

export const useTableOpen = () => {
  const { url } = useAtomValue(filePath);
  const sheet = useAtomValue(sheetSelected);
  const setData = useSetAtom(tableData);

  return useCallback(async () => {
    try {
      const response = await invoke<TableDataType>("load_data", {
        url,
        sheetName: sheet,
      });
      console.log(response);

      if (response.response_code === 200) {
        setData(response);
        return { response_code: 200, message: response.message };
      }

      if (response.response_code === 404) {
        return { response_code: 404, message: response.message };
      }

      return {
        status: response.response_code,
        error: response.message || "Unknown error",
      };
    } catch (error) {
      console.error("Error loading table data:", error);
    }
  }, [url, sheet, setData]);
};
