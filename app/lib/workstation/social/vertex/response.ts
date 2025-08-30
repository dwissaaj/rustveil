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
