import { invoke } from "@tauri-apps/api/core";
<<<<<<< HEAD
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
=======
import { useAtomValue } from "jotai";

import { vertex1ColumnSelected, vertex2ColumnSelected } from "../../data/state";

import { SetVerticesResponse } from "./response";

export function useSetVertices() {
  const vertex1 = useAtomValue(vertex1ColumnSelected);
  const vertex2 = useAtomValue(vertex2ColumnSelected);
  const setVertices = async () => {
    try {
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
      const response = await invoke<SetVerticesResponse>("set_vertices", {
        verticesSelected: {
          vertex_1: vertex1,
          vertex_2: vertex2,
<<<<<<< HEAD
          graph_type: graphType,
        },
      });

      setVerticesCreatedAt(now);
=======
        },
      });

>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
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
