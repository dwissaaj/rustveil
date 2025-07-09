// useMapId.ts
import { invoke } from "@tauri-apps/api/core";
import { RustResponse } from "../data/dto";
import { useVerticesData } from "./useVerticesData";
import { MappingProgress } from "./useMapProgress";
import { useState } from "react";


export const useMapId = () => {
  const { vertex1Data, vertex2Data, graphType, setedgesValue, setcentralityValue} = useVerticesData()
  const [progress, setProgress] = useState<MappingProgress>({
    progress: 0,
    message: "Ready",
    isError: false
  });

  return async () => {
    try {
      const result = await invoke<RustResponse>("user_to_vector", { 
        verticesOne: vertex1Data,
        verticesTwo: vertex2Data ,
        graphType : graphType
      });
        if(result.data.status === 200)
          setedgesValue(result.data.edges)
          setcentralityValue(result.data.centrality_result)
         
    } catch (error) {
      console.error("Error loading table data:", error);
      throw error; // Re-throw for error handling
    }
  };
};