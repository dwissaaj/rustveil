import { atom } from "jotai";

export interface CalculateCentralityType {
  node_map?: Record<number, string>;
  betweenness_centrality?: Array<number>;
  degree_centrality?: Array<number>;
  eigenvector_centrality?: Array<number>;
  katz_centrality?: Array<number>;
  closeness_centrality?: Array<number>;
}

export const centralityData = atom<{
  graphData: CalculateCentralityType;
} | null>(null);


export type NetworkNodeType = {
  id: string
  height: number
  size: number
  color: string
}

export type NetworkLinkType = {
  source: string
  target: string
  distance: number
}

export type NetworkGraphType = {
  nodes: NetworkNodeType[]
  links: NetworkLinkType[]
}

export const NetworkGraphData = atom<NetworkGraphType>({
  nodes: [],
  links: [],
})
