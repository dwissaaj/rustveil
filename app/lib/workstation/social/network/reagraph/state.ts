import { atom } from "jotai";

export type ReagraphNode = {
  id: string;
  label: string;
};

export type ReagraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type NetworkGraph = {
  nodes: ReagraphNode[];
  edges: ReagraphEdge[];
};

export const ReagraphData = atom<NetworkGraph>({
  nodes: [],
  edges: [],
});
