import { invoke } from "@tauri-apps/api/core";
import { CalculateCentralityResponse } from "../vertex/response";

export function useCalcCentrality() {
    const getCentrality = async () => {
        try {
            const response = await invoke<CalculateCentralityResponse>('get_data_vertex')
            if ("Success" in response) {
                return {
                response_code: response.Success.response_code,
                message: response.Success.message,
                };
            } else if ("Error" in response) {
                return {
                response_code: response.Error.response_code,
                message: response.Error.message,
                };
            }
        } catch (error: any) {
          return {
                response_code: 500,
                message: "Error hook calculate to back end",
            };
        }
    }
    return getCentrality
}
