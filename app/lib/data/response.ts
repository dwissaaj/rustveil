export interface ResponseSuccess {
  response_code: number;
  message: string;
  data: Record<string, any>[];
  total_count?: number;
  total_negative_data?: number;
  total_positive_data?: number;
}

export interface ResponseError {
  response_code: number;
  message: string;
}

export type InvokeResponse =
  | { Success: ResponseSuccess }
  | { Error: ResponseError };
