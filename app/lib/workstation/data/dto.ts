export type TableCell = string | number | boolean | null;
interface UserNode {
  id: number;
  username: string;
}


export interface TableDataType {
  headers: string[];
  rows: Record<string, TableCell>[];
  status?: number;
  error?: string;
}

export interface VerticesCentralityTable {
  columns: string[],
  status?: number,
  error?: string,
  nodeMap?: Record<number, string>,
  edges?: Record<number,number>,
  centrality_result?: number[]
}



