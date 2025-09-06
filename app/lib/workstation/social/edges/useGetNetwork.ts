import { useAtom } from "jotai";
import { invoke } from "@tauri-apps/api/core";

import { GetEdgesResponse } from "./response";
import { NetworkGraphData } from "./state";
import { transformEdgesToGraph } from "./useTransform";

export function useGetEdges() {
  const [, setGraphAtom] = useAtom(NetworkGraphData);
  const getEdges = async () => {
    try {
      const response = await invoke<GetEdgesResponse>("get_all_vertices");

      if ("Success" in response) {
        const transformData = transformEdgesToGraph(
          response.Success.data || [],
        );

        setGraphAtom(transformData);

        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          data: response.Success.data || [],
          total_count: response.Success.total_count || 0,
        };
      } else if ("Error" in response) {
        return {
          response_code: response.Error.response_code,
          message: response.Error.message,
        };
      }
    } catch (error) {
      return {
        response_code: 500,
        message: `Error at get all edges ${error}`,
      };
    }
  };

  return getEdges;
}
