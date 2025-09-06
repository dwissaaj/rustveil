import { invoke } from "@tauri-apps/api/core";
import { CalculateCentralityResponse } from "../vertex/response";
import { useAtom, useAtomValue } from "jotai";
import { vertexGraphTypeSelected } from "../../data/state";
import { centralityData } from "../edges/state";

export function useCalculateCentrality() {
  const graphType = useAtomValue(vertexGraphTypeSelected);
  const [graphData, setGraphData] = useAtom(centralityData);

  const getCentrality = async () => {
    try {
      const response = await invoke<CalculateCentralityResponse>(
        "calculate_centrality",
        {
          graphType: graphType,
        },
      );
      console.log(response);
      if ("Success" in response) {
        setGraphData({
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
    } catch (error: any) {
      return {
        response_code: 500,
        message: "Error hook calculate to back end",
      };
    }
  };
  return getCentrality;
}
