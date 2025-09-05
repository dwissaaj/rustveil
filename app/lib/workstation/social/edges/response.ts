export interface GetEdgesSuccess {
  response_code: number;
  message: string;
  data ?: Array<[string, string]>;
  total_count?: number;  
}

export interface GetEdgesError {
  response_code: number;
  message: string;
}

export type GetEdgesResponse =
  | { Success: GetEdgesSuccess }
  | { Error: GetEdgesError };

