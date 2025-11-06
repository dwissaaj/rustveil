import { useAtom } from "jotai";
import { invoke } from "@tauri-apps/api/core";

import { ReagraphData, ReagraphNode, ReagraphEdge } from "./state";
<<<<<<< HEAD

import { GetEdgesResponse } from "@/app/lib/workstation/social/network/response";

=======
import { GetEdgesResponse } from "@/app/lib/workstation/social/network/response";


>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
// Utility to transform Tauri edges to Reagraph nodes & edges
function transformEdgesToReagraph(edges: { source: string; target: string }[]) {
  const nodesMap: Record<string, ReagraphNode> = {};
  const edgesList: ReagraphEdge[] = [];

  edges.forEach((e) => {
    // Add nodes if not exist
    if (!nodesMap[e.source]) {
      nodesMap[e.source] = { id: e.source, label: e.source };
    }
    if (!nodesMap[e.target]) {
      nodesMap[e.target] = { id: e.target, label: e.target };
    }

    // Add edge
    const edgeId = `${e.source}-${e.target}`;
<<<<<<< HEAD

=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
    edgesList.push({
      id: edgeId,
      source: e.source,
      target: e.target,
      label: edgeId,
    });
  });

  return {
    nodes: Object.values(nodesMap),
    edges: edgesList,
  };
}

export function GetReagraph() {
  const [, setReagraphData] = useAtom(ReagraphData);

  const getdatareagraph = async () => {
    try {
      const response = await invoke<GetEdgesResponse>("get_all_vertices");

      if ("Success" in response) {
<<<<<<< HEAD
        const reagraphData = transformEdgesToReagraph(
          response.Success.data || [],
        );
=======
        const reagraphData = transformEdgesToReagraph(response.Success.data || []);
        console.log("resat", response.Success.data);

>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08

        setReagraphData(reagraphData);

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
        message: `Error at get all edges ${error}`,
      };
    }
  };

  return getdatareagraph;
}
