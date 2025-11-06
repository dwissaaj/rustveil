import { getDefaultStore } from "jotai";

<<<<<<< HEAD
import { centralityData } from "../calculate/state";

import { NetworkGraphType, NetworkNodeType, NetworkLinkType } from "./state";
=======
import { NetworkGraphType, NetworkNodeType, NetworkLinkType } from "./state";
import { centralityData } from "../calculate/state";
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08

export interface Edge {
  source: string;
  target: string;
}

export function transformEdgesToGraph(data?: Edge[]): NetworkGraphType {
  const store = getDefaultStore();
  const centralityAtomValue = store.get(centralityData);

  // --- build lookup from node_map + betweenness_centrality ---
  const betweenness: Record<string, number> = {};
  const nodeMap = centralityAtomValue?.graphData?.node_map ?? {};
  const betweennessArr =
    centralityAtomValue?.graphData?.betweenness_centrality ?? [];

  Object.entries(nodeMap).forEach(([index, id]) => {
    const idx = Number(index);
    const value = betweennessArr[idx] ?? 0;

    betweenness[id] = isFinite(value) ? value : 0; // ✅ guard against NaN/Infinity
  });

  if (!data || data.length === 0) return { nodes: [], links: [] };

  // --- normalize values for scaling ---
  const values = Object.values(betweenness);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;

  const minSize = 8;
  const maxSize = 40;

  function scale(val: number): number {
    if (!isFinite(val)) return minSize; // ✅ guard
    if (max === min) return (minSize + maxSize) / 2;
    const norm = (val - min) / (max - min);

    return Math.max(minSize, minSize + norm * (maxSize - minSize)); // ✅ clamp ≥ minSize
  }

  function color(val: number): string {
    if (!isFinite(val) || max === min) return `hsl(200, 70%, 50%)`;
    const norm = (val - min) / (max - min);

    return `hsl(${200 + norm * 120}, 70%, 50%)`;
  }

  const nodesMap = new Map<string, NetworkNodeType>();
  const links: NetworkLinkType[] = [];

  for (const { source, target } of data) {
    if (!nodesMap.has(source)) {
      const value = betweenness[source] ?? 0;

      nodesMap.set(source, {
        id: source,
        height: 1,
        size: scale(value),
        color: color(value),
      });
    }
    if (!nodesMap.has(target)) {
      const value = betweenness[target] ?? 0;

      nodesMap.set(target, {
        id: target,
        height: 1,
        size: scale(value),
        color: color(value),
      });
    }
    links.push({ source, target, distance: 80 });
  }

  return { nodes: Array.from(nodesMap.values()), links };
}
