// useTransform.ts
import { useAtomValue } from "jotai";
import { edgesData } from "./state"; // edges atom [{source, target}]

export function useTransform() {
  const edges = useAtomValue(edgesData);

  const getNivoData = () => {
    // 1️⃣ Build nodes map and degree centrality
    const nodesMap: Record<string, { id: string; size: number; color: string }> = {};
    const degreeMap: Record<string, number> = {};

    edges.forEach((edge) => {
      degreeMap[edge.source] = (degreeMap[edge.source] || 0) + 1;
      degreeMap[edge.target] = (degreeMap[edge.target] || 0) + 1;

      if (!nodesMap[edge.source]) nodesMap[edge.source] = { id: edge.source, size: 10, color: "rgb(97,205,187)" };
      if (!nodesMap[edge.target]) nodesMap[edge.target] = { id: edge.target, size: 10, color: "rgb(97,205,187)" };
    });

    // 2️⃣ Scale node size based on degree centrality
    Object.keys(nodesMap).forEach((key) => {
      nodesMap[key].size = 10 + (degreeMap[key] || 1) * 2; // scaling factor
    });

    // 3️⃣ Build links
    const links = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      distance: 50, // optional
    }));

    const nodes = Object.values(nodesMap);

    return { nodes, links };
  };

  return getNivoData;
}
