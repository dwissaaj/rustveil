import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";
import { vertex1ColumnData, vertex2ColumnData } from "../data/state";
import { VerticesCentralityTable } from "../data/dto";
export interface ProcessingStatus {
  progress: number;
  message: string;
}

export type ProcessingResult = 
  | { status: "Loading"; data: ProcessingStatus }
  | { status: "Complete"; data: VerticesCentralityTable }
  | { status: "Error"; data: string };

export const useMapId = () => {
  const vert1 = useAtomValue(vertex1ColumnData)
  const vert2 = useAtomValue(vertex2ColumnData)
  return async () => {
    try {
      console.log(vert1)
      console.log(vert2)
      const result = await invoke<ProcessingResult>("user_to_vector", { 
        verticesOne: vert1,
        verticesTwo: vert2 
      });
    switch (result.status) {
      case "Loading":
        return { progress: 30,
                 message: "Holdon"}
      case "Complete":
        return { progress: 100,
                 message: "good"}
      case "Error":
        return { progress: 0,
                 message: "error"}
    }
    } catch (error) {
      console.error("Error loading table data:", error);
    }
  };
};
