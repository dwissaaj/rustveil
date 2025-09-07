import { atom } from "jotai";

export type NetworkNodeType = {
  id: string;
  height: number;
  size: number;
  color: string;
};

export type NetworkLinkType = {
  source: string;
  target: string;
  distance: number;
};

export type NetworkGraphType = {
  nodes: NetworkNodeType[];
  links: NetworkLinkType[];
};

export const NetworkGraphData = atom<NetworkGraphType>({
  nodes: [],
  links: [],
});
