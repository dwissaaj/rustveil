
import { invoke } from "@tauri-apps/api/core";
import { centralityData } from "../edges/dto";
import { useAtom } from "jotai";
import { CalculateCentralityResponse } from "./response";

export function useGetCentrality() {
  const [,setGraphData] = useAtom(centralityData)
  const getCentrality = async () => {
    try {
      const response = await invoke<CalculateCentralityResponse>("load_centrality_table");

      if ("Success" in response) {
        setGraphData({
                    graphData: {
                        node_map: response.Success.node_map,
                        betweenness_centrality: response.Success.betweenness_centrality,
                        degree_centrality: response.Success.degree_centrality,
                        eigenvector_centrality: response.Success.eigenvector_centrality,
                        katz_centrality: response.Success.katz_centrality,
                        closeness_centrality: response.Success.closeness_centrality,
                    }
                })
                return {
                response_code: response.Success.response_code,
                message: response.Success.message,
                node_map: response.Success.node_map,
                edges: response.Success.edges,
                vertices: response.Success.vertices ,
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
      console.log("Error:", error);
      throw error;
    }
  };

  return getCentrality;
}
