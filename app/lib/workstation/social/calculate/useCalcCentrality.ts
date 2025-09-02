import { invoke } from "@tauri-apps/api/core";
import { CalculateCentralityResponse } from "../vertex/response";

export function useCalcCentrality() {
    const getCentrality = async () => {
        try {
            const response = await invoke<CalculateCentralityResponse>('get_data_vertex')
            console.log(response)
            if ("Success" in response) {
                return {
                response_code: response.Success.response_code,
                message: response.Success.message,
                node_map: response.Success.node_map,
                edges: response.Success.edges,
                centrality_result: response.Success.centrality_result,
                vertices: response.Success.vertices 
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
