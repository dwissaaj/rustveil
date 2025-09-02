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
