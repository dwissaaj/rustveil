export interface Edge {
  source: string;
  target: string;
}
export interface GetEdgesSuccess {
  response_code: number;
  message: string;
  data?: Edge[];
  total_count?: number;
}

export interface GetEdgesError {
  response_code: number;
  message: string;
}

export type GetEdgesResponse =
  | { Success: GetEdgesSuccess }
  | { Error: GetEdgesError };
