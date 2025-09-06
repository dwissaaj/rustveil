import { invoke } from "@tauri-apps/api/core";
import { InvokeResponse } from "../../response";

export function useGetAllData() {
  const getAll = async () => {
    try {
      const response = await invoke<InvokeResponse>("get_all_data");
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
    } catch (error) {
      return {
          response_code:500,
          message: 'Error at hook get all data client',
        };
    }
  };
  return getAll;
}
