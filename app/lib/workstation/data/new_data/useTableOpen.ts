import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";
import { filePath, sheetSelected } from "../state";
import { InvokeResponse } from "../response";

export function useTableOpen() {
  const { url } = useAtomValue(filePath);
  const sheet = useAtomValue(sheetSelected);

  const loadTable = async () => {
    try {
      const response = await invoke<InvokeResponse>("load_data", {
        url,
        sheetName: sheet,
      });
      console.log(response)
      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          data: response.Success.data,
        };
      } else if ("Error" in response) {
        return {
          response_code: response.Error.error_code,
          message: response.Error.message,
        };
      }
    } catch (error: any) {
      return {
        response_code: 500, 
        message: "Error loading table data",
      };
    }
  };
  return loadTable;
}
