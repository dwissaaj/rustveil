// useMapId.ts
import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";
import { vertex1ColumnData, vertex2ColumnData } from "../data/state";
import { VerticesCentralityTable } from "../data/dto";
import { useMapProgress } from "./useMapProgress";
import { useVerticesData } from "./useVerticesData";

export interface ProcessingStatus {
  progress: number;
  message: string;
}

export type ProcessingResult = 
  | { status: "Loading"; data: ProcessingStatus }
  | { status: "Complete"; data: VerticesCentralityTable }
  | { status: "Error"; data: string };

export const useMapId = () => {
  const { vertex1Data, vertex2Data, graphType} = useVerticesData()
  return async () => {
    try {
      console.log("vert1", vertex1Data);
      console.log("vert2", vertex2Data);
      
      const result = await invoke<ProcessingResult>("user_to_vector", { 
        verticesOne: vertex1Data,
        verticesTwo: vertex2Data ,
        graphType : graphType
      });
      
      return result;
    } catch (error) {
      console.error("Error loading table data:", error);
      throw error; // Re-throw for error handling
    }
  };
};