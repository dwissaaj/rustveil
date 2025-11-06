import { invoke } from "@tauri-apps/api/core";
import { useAtomValue, useSetAtom } from "jotai";

import { SetVerticesResponse } from "./response";

import {
  targetVerticesCreatedAt,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
} from "@/app/lib/data/state";

export function useSetVertices() {
  const vertex1 = useAtomValue(vertex1ColumnSelected);
  const vertex2 = useAtomValue(vertex2ColumnSelected);
  const graphType = useAtomValue(vertexGraphTypeSelected);
  const setVerticesCreatedAt = useSetAtom(targetVerticesCreatedAt);

  const setVertices = async () => {
    try {
      const now = new Date().toISOString();
      const response = await invoke<SetVerticesResponse>("set_vertices", {
        verticesSelected: {
          vertex_1: vertex1,
          vertex_2: vertex2,
          graph_type: graphType,
        },
      });

      setVerticesCreatedAt(now);
      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
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
        message: `Error hook set vertices to back end ${error}`,
      };
    }
  };

  return setVertices;
}
