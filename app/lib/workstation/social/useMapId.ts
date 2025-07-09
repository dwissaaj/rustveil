// useMapId.ts
import { invoke } from "@tauri-apps/api/core";
import { RustResponse } from "../data/dto";
import { useGraphData } from "./useGraphData";

export const useMapId = () => {
  const { vertex1Data, vertex2Data, graphType, setedgesValue, setcentralityValue, setnodeMap, setverticesValue} = useGraphData()


  return async () => {
    try {
      const result = await invoke<RustResponse>("user_to_vector", { 
        verticesOne: vertex1Data,
        verticesTwo: vertex2Data ,
        graphType : graphType
      });
        if(result.data.status === 200)
          console.log(result)
          console.log('node map', result.data.node_map)
          setedgesValue(result.data.edges)
          setcentralityValue(result.data.centrality_result)
          setverticesValue(result.data.columns)
          setnodeMap(result.data.node_map)
         
    } catch (error) {
      console.error("Error loading table data:", error);
      throw error; // Re-throw for error handling
    }
  };
};