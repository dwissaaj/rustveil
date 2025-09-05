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

export interface NetworkNode {
  id: string;
  height: number;
  size: number;
  color: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  distance: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}