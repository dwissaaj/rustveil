import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";
import { filePath } from "../state";
import { InvokeResponse } from "../response";

export function useOpenDatabase() {
  const pathfile = useAtomValue(filePath);
  const loadTable = async () => {
    try {
      const response = await invoke<InvokeResponse>("load_data_sqlite", {
        pathfile: pathfile.url,
      });
      if ("Complete" in response) {
        return {
          response_code: response.Complete.response_code,
          message: response.Complete.message,
          data: response.Complete.data,
          total_count: response.Complete.total_count,
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
        message: `Error loading table data ${error}`,
      };
    }
  };
  return loadTable;
}
