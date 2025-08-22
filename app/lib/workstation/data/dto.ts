export type TableCell = string | number | boolean | null;
export interface TableDataType {
  data: Record<string, TableCell>[];
  response_code?: number;
  message?: string;
}
export interface UserNode {
  id: number;
  username: string;
}

// pub struct DataTable {
//     /// HTTP-like response code (e.g., 200 for success).
//     pub response_code: u32,
//     /// The processed dataset as an array of JSON objects.
//     pub data: Vec<Value>,
//     /// Descriptive message for the result.
//     pub message: String,
// }

export interface VerticesCentralityTable {
  columns: string[];
  status?: number;
  error?: string;
  node_map?: Record<number, string>;
  edges?: Record<number, number>;
  centrality_result?: number[];
}

export interface RustResponse {
  data: VerticesCentralityTable;
  status: string;
}

export interface CentralityTableData {
  id: number;
  username: string;
  centrality: number;
}

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

export interface NetworkGraphDataType {
  nodes: NetworkNodeType[];
  links: NetworkNodeLinkType[];
}
