export interface ResponseSuccess {
  response_code: number;
  message: string;
  data: Record<string, any>[];
}

export interface ResponseError {
  error_code: number;
  message: string;
}


export type InvokeResponse = 
  | { Complete: ResponseSuccess }
  | { Error: ResponseError };