export interface SetVerticesSuccess {
  response_code: number;
  message: string;
}

export interface SetVerticesError {
  response_code: number;
  message: string;
}

export type SetVerticesResponse =
  | { Success: SetVerticesSuccess }
  | { Error: SetVerticesError };

export interface CalculateCentralitySuccess {
  response_code: number;
  message: string;
  node_map?: Record<number, string>;
  edges?: Array<[number, number]>;
  vertices?: Array<[string, string]>;
  betweenness_centrality?: Array<number>;
  degree_centrality?: Array<number>;
  eigenvector_centrality?: Array<number>;
  katz_centrality?: Array<number>;
  closeness_centrality?: Array<number>;
}

export interface CalculateCentralityError {
  response_code: number;
  message: string;
}

export type CalculateCentralityResponse =
  | { Success: CalculateCentralitySuccess }
  | { Error: CalculateCentralityError };
