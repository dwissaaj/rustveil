
import { invoke } from "@tauri-apps/api/core";
import { InvokeResponse } from "../../response";
export function useGetAllData() {
  const getAll = async () => {
    try {
      const response = await invoke<InvokeResponse>("get_all_data");
      if ("Complete" in response) {
        return {
          response_code: response.Complete.response_code,
          message: response.Complete.message,
          data: response.Complete.data,
        };
      } else if ("Error" in response) {
        return {
          response_code: response.Error.error_code,
          message: response.Error.message,
        };
      }
    } catch (error) {
      console.log("Console at get all", error);
    }
  };
  return getAll;
}
