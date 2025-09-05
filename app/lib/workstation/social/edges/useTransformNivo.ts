import { useAtom, useAtomValue } from "jotai";
import { vertex1ColumnSelected, vertex2ColumnSelected } from "../../data/state";
import { invoke } from "@tauri-apps/api/core";
import { GetEdgesResponse } from "./response";
import { edgesData } from "./state";

export function useTransformNivo() {
  const vertex1 = useAtomValue(vertex1ColumnSelected);
  const vertex2 = useAtomValue(vertex2ColumnSelected);
  const [, setEdgesData] = useAtom(edgesData);  // ✅ useAtom, not useAtomValue

  const getTransformNivo = async () => {
    try {
      const response = await invoke<GetEdgesResponse>("get_all_vertices", {
        vertex_1: vertex1,
        vertex_2: vertex2,
      });
      console.log("response", response);

      if ("Success" in response) {
        setEdgesData(response.Success.data || []); // ✅ safe set
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
        message: "Error invoking get_all_vertices",
      };
    }
  };

  return getTransformNivo;
}
