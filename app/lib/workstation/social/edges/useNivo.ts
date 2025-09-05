import { useAtomValue } from "jotai";
import { edgesData, centralityData } from "./state";

export function useNivoGraphDataWithDegree() {
  const edges = useAtomValue(edgesData);
  const centrality = useAtomValue(centralityData)?.graphData;

  const getNivoData = () => {
    if (!edges || !centrality) return { nodes: [], links: [] };

    const nodeSet = new Set<string>();
    const nodes: { id: string; size: number; color: string }[] = [];
    const links: { source: string; target: string; distance: number }[] = [];

    // Create links
    edges.forEach(edge => {
      nodeSet.add(edge.source);
      nodeSet.add(edge.target);
      links.push({
        source: edge.source,
        target: edge.target,
        distance: 50, // default distance
      });
    });

    // Create nodes with degree centrality as size
    nodeSet.forEach(id => {
      // Find the index of this node in centrality.node_map
      let idx: number | undefined;
      if (centrality.node_map) {
        for (const [k, v] of Object.entries(centrality.node_map)) {
          if (v === id) {
            idx = parseInt(k, 10);
            break;
          }
        }
      }

      const degree = idx !== undefined && centrality.degree_centrality
        ? centrality.degree_centrality[idx] ?? 1
        : 1;

      nodes.push({
        id,
        size: 8 + degree * 5, // scale size by degree
        color: "rgb(97, 205, 187)",
      });
    });

    return { nodes, links };
  };

  return getNivoData;
}
