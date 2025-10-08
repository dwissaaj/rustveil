// targeted at mod workstation/sentiment_analysis/state
export interface ColumnTargetSuccess {
  response_code: number;
  message: string;
  target: string;
}

export interface ColumnTargetError {
  response_code: number;
  message: string;
}

export type ColumnTargetSelectedResult =
  | { Success: ColumnTargetSuccess }
  | { Error: ColumnTargetError };
