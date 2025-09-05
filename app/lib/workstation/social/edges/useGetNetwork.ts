import { useAtom, useAtomValue } from "jotai";
import { dataTable, vertex1ColumnSelected, vertex2ColumnSelected } from "../../data/state";
import { useDataColumn } from "../handler/useColumn";
import { invoke } from "@tauri-apps/api/core";
import { GetEdgesResponse } from "./response";
import { edgesData } from "./state";

export function useGetEdges() {
  const vertex1 = useAtomValue(vertex1ColumnSelected);
  const vertex2 = useAtomValue(vertex2ColumnSelected);
  const [,setEdgesData] = useAtom(edgesData);
  const getEdges = async () => {
    try {
      const response = await invoke<GetEdgesResponse>("get_all_vertices") 
      console.log(response)
      if("Success" in response) {
        setEdgesData(
          response.Success.data || [],
        )
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          data: response.Success.data || [],
          total_count: response.Success.total_count || 0,
        }
      }
      else if("Error" in response)  {
        return {
          response_code: response.Error.response_code,
          message: response.Error.message,
        }
      }
    } catch (error) {
        return {
          response_code: 500,
          message: "Error invoking get all vertices",
        };
    }
  };

  return getEdges;
}
