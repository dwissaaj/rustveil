import { atom } from "jotai";
import { InputNode, InputLink } from "@nivo/network";
import { NetworkData } from "./response";

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



export const edgesData = atom<any[]>([]);

export const networkData = atom<NetworkData>({
  nodes: [],
  links: [],
});