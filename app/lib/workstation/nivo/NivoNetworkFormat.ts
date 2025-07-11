// import { useMemo } from 'react';

import { Console } from "console";
import { CentralityTableData, NetworkNodeLinkType, NetworkNodeType } from "../data/dto";

export const useNivoNodes = (centrality: CentralityTableData[]): NetworkNodeType[] => {
  return centrality.map(node => ({
    id: node.username,  // Directly use username as ID
    size: node.centrality * 2 + 10,  // Minimum size 10 + centrality scaling
    color: `hsl(${200 + node.centrality * 10}, 70%, 50%)`, // Blue-based color
    height: 1,
    centrality: node.centrality  // Preserve original value
  }));
};
export const useNivoLinks = (
  edges: [number, number][] | undefined,
  centralityData: CentralityTableData[],
): NetworkNodeLinkType[] => {
  if (!edges) return [];

  // ✅ No need to use Object.entries anymore
  const idToUsername = Object.fromEntries(
    centralityData.map((node) => [node.id, node.username])
  );

  const idToCentrality = Object.fromEntries(
    centralityData.map((node) => [node.id, node.centrality])
  );

  return edges.map(([sourceId, targetId]) => ({
    source: idToUsername[sourceId] ?? `User-${sourceId}`,
    target: idToUsername[targetId] ?? `User-${targetId}`,
    distance: (idToCentrality[sourceId] ?? 0) * 2 + (idToCentrality[sourceId] === 0 ? 5 : 0),
  }));
};