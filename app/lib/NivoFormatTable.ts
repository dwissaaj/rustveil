import { GraphTableData } from "./workstation/data/dto";
export interface NivoBarDatum {
  username: string;
  centrality: number;
  [key: string]: string | number;
}

export const NivoTransformTable = (
  graphData: GraphTableData[],
): NivoBarDatum[] => {
  return graphData.map((item) => ({
    username: item.username,
    centrality: item.centrality,
  }));
};
