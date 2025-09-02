export interface SetVerticesSuccess {
  response_code: number;
  message: string;

}

export interface SetVerticesError {
  response_code: number;
  message: string;
}

export type SetVerticesResponse =
  | { Complete: SetVerticesSuccess }
  | { Error: SetVerticesError };

  


export interface CalculateCentralitySuccess {
  response_code: number;
  message: string;
  node_map?: Record<number, string>;
  edges ?: Array<[number, number]>;
  centrality_result ?: Array<number>;
  vertices ?: Array<[string, string]>;
}

export interface CalculateCentralityError {
  response_code: number;
  message: string;
}

export type CalculateCentralityResponse =
  | { Success: CalculateCentralitySuccess }
  | { Error: CalculateCentralityError };

  