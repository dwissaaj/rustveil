import { atom } from 'jotai';

// Store the complete graph data
export const graphDataAtom = atom<{
  nodes: NetworkNodeType[];
  links: NetworkNodeLinkType[];
  nodeMap: { [id: number]: string };
  originalVertices: [string, string][];
  centralityScores: number[];
} | null>(null);

// Store loading state
export const graphLoadingAtom = atom(false);

// Store error state
export const graphErrorAtom = atom<string | null>(null);

export interface NetworkNodeType {
  id: string;
  size: number;
  color: string;
  height?: number;
  centrality: number;
}

export interface NetworkNodeLinkType {
  source: string;
  target: string;
  distance: number;
}



// Store the complete RAW graph data from backend
// Store the complete RAW graph data from backend
export const rawGraphDataAtom = atom<{
  node_map?: Record<number, string>;
  edges?: Array<[number, number]>;
  centrality_result?: Array<number>;
  vertices?: Array<[string, string]>;
  message: string;
  response_code: number;
} | null>(null);

export const nivoGraphDataAtom = atom<{
  nodes: {
    id: string;
    size: number;
    color: string;
    centrality: number;
  }[];
  links: {
    source: string;
    target: string;
    distance: number;
  }[];
} | null>(null);