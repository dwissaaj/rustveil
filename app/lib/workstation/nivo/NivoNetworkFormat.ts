import {
  CentralityTableData,
  NetworkGraphDataType,
  TableCell,
} from "../data/dto";

export const useNetworkData = (
  centrality: CentralityTableData[],
  vertex1Data: TableCell[],
  vertex2Data: TableCell[],
): NetworkGraphDataType => {
  const nodes = centrality.map((node) => ({
    id: node.username,
    height: 1,
    size: 10 + node.centrality * 2,
    color: `hsl(${200 + node.centrality * 10}, 70%, 50%)`,
    centrality: node.centrality,
  }));

  const links = vertex1Data.map((source, index) => ({
    source: String(source),
    target: String(vertex2Data[index]),
    distance: Math.floor(Math.random() * 90 + 10),
  }));
  return { nodes, links };
};
