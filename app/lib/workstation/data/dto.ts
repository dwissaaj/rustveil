export type TableCell = string | number | boolean | null;
export interface UserNode {
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
  id: string;          // Required - Unique identifier (username)
  size: number;        // Required - Visual size (pixels)
  color: string;       // Required - CSS color value
  height?: number;     // Optional - Z-index for 3D (default 1)
  centrality: number
}

export interface NetworkNodeLinkType {
  source: string,
  target: string,
  distance: number
}
// {
//       "id": "Node 1",
//       "height": 1,
//       "size": 24,
//       "color": "rgb(97, 205, 187)"
//     },


// "links": [
//     {
//       "source": "Node 0",
//       "target": "Node 1",
//       "distance": 80
//     },
//     {
//       "source": "Node 1",
//       "target": "Node 1.0",
//       "distance": 50
//     },