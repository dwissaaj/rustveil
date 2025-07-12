import { CentralityTableData } from "../data/dto";

export interface NivoBarDatum {
  username: string;
  centrality: number;
  [key: string]: string | number;
}

export const NivoTransformTable = (
  graphData: CentralityTableData[],
): NivoBarDatum[] => {
  return graphData.map((item) => ({
    username: item.username,
    centrality: item.centrality,
  }));
};
