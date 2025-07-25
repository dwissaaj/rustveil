// useMapId.ts
import { invoke } from "@tauri-apps/api/core";
import { RustResponse } from "../data/dto";
import { useGraphData } from "./useGraphData";

export const useMapId = () => {
  const {
    vertex1Data,
    vertex2Data,
    graphType,
    setedgesValue,
    setcentralityValueData,
  } = useGraphData();

  return async () => {
    try {
      const result = await invoke<RustResponse>("user_to_vector", {
        verticesOne: vertex1Data,
        verticesTwo: vertex2Data,
        graphType: graphType,
      });
      if (result.data.status === 200) setedgesValue(result.data.edges);

      const newData = Object.entries(result?.data?.node_map || {}).map(
        ([key, value]) => ({
          id: parseInt(key),
          username: value,
          centrality: result?.data?.centrality_result?.[parseInt(key)] || 0,
        }),
      );
      setcentralityValueData(newData);
    } catch (error) {
      console.error("Error loading table data:", error);
      throw error;
    }
  };
};
