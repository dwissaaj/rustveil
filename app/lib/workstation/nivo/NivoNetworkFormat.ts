// import { useMemo } from 'react';

import { Console } from "console";
import { CentralityTableData, NetworkGraphDataType, NetworkNodeLinkType, NetworkNodeType } from "../data/dto";
import { useGraphData } from "../social/useGraphData";
import { atom } from "jotai";
import { NodesNetworkData } from "../data/state";


export const useNivoNodes = (centrality: CentralityTableData[]): NetworkNodeType[] => {
  return centrality.map(node => ({
    id: node.username,  // Directly use username as ID
    size: node.centrality * 2 + 10,  // Minimum size 10 + centrality scaling
    color: `hsl(${200 + node.centrality * 10}, 70%, 50%)`, // Blue-based color
    height: 1,
    centrality: node.centrality  // Preserve original value
  }));
};
export const useNivoLinks = (): NetworkNodeLinkType[] => {
  const { vertex1Data, vertex2Data } = useGraphData();

  const mat = Math.floor(Math.random() * 90 + 10);
  
  // Convert TableCell to string explicitly
  const edges = vertex1Data.map((source, index) => ({
    source: String(source), // Force conversion to string
    target: String(vertex2Data[index]), // Force conversion to string
    distance: mat
  }));
  return edges;
};

export const useNetworkData = (): NetworkGraphDataType => {
  const { vertex1Data, vertex2Data, centralityValueData } = useGraphData();
  const nodes = centralityValueData.map(node => ({
    id: node.username,
    height: 1,
    size: 10 + node.centrality * 2, // Adjust scaling as needed
    color: `hsl(${200 + node.centrality * 10}, 70%, 50%)`,
    centrality:node.centrality
  }));

  const links = vertex1Data.map((source, index) => ({
    source: String(source),
    target: String(vertex2Data[index]),
    distance: Math.floor(Math.random() * 90 + 10) // Random 10-100
  }));
  return { nodes, links };
};