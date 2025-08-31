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

}

export interface CalculateCentralityError {
  response_code: number;
  message: string;
}

export type CalculateCentralityResponse =
  | { Success: CalculateCentralitySuccess }
  | { Error: CalculateCentralityError };

  