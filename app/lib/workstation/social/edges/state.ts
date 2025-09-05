import { atom } from "jotai";
import { InputNode, InputLink } from "@nivo/network";

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


interface NivoNode extends InputNode {
    id: string;
    size: number;
    color: string;
}

interface NivoLink extends InputLink {
    source: string;
    target: string;
    distance: number;
}

// In your hook
const nodes: NivoNode[] = [];
const links: NivoLink[] = [];

export const edgesData = atom<any[]>([]);