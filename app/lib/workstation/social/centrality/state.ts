import { atom } from "jotai";

export const selectedChart = atom<"pie" | "bar">("pie"); 

export type CentralityKey =
  | "betweenness_centrality"
  | "degree_centrality"
  | "eigenvector_centrality"
  | "katz_centrality"
  | "closeness_centrality";

export const selectedCentrality = atom<CentralityKey>("betweenness_centrality");