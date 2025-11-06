import { invoke } from "@tauri-apps/api/core";
import { useAtom } from "jotai";

<<<<<<< HEAD
import { CalculateCentralityResponse } from "../vertices/response";

import { centralityData } from "./state";
=======
import { centralityData } from "./state";
import { CalculateCentralityResponse } from "../vertices/response";
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08

export function useGetCentrality() {
  const [, setCentralityData] = useAtom(centralityData);
  const getCentrality = async () => {
    try {
      const response = await invoke<CalculateCentralityResponse>(
        "load_centrality_table",
      );

      if ("Success" in response) {
        setCentralityData({
          graphData: {
            node_map: response.Success.node_map,
            betweenness_centrality: response.Success.betweenness_centrality,
            degree_centrality: response.Success.degree_centrality,
            eigenvector_centrality: response.Success.eigenvector_centrality,
            katz_centrality: response.Success.katz_centrality,
            closeness_centrality: response.Success.closeness_centrality,
          },
        });

        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          node_map: response.Success.node_map,
          edges: response.Success.edges,
          vertices: response.Success.vertices,
          betweenness_centrality: response.Success.betweenness_centrality,
          degree_centrality: response.Success.degree_centrality,
          eigenvector_centrality: response.Success.eigenvector_centrality,
          katz_centrality: response.Success.katz_centrality,
          closeness_centrality: response.Success.closeness_centrality,
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
        message: `Error at hook get centrality data ${error}`,
      };
    }
  };

  return getCentrality;
}
