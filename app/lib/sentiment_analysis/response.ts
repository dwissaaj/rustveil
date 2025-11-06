// targeted at mod workstation/sentiment_analysis/state
export interface ColumnTargetSuccess {
  response_code: number;
  message: string;
  column_target: string
  language_target: string;
}

export interface ColumnTargetError {
  response_code: number;
  message: string;
}

export type ColumnTargetSelectedResult =
  | { Success: ColumnTargetSuccess }
  | { Error: ColumnTargetError };

export interface SentimentAnalysisSuccess extends ColumnTargetError {
  total_data: number;
  total_negative_data: number;
  total_positive_data: number;
}
export type SentimentAnalysisResult =
  | { Success: SentimentAnalysisSuccess }
  | { Error: ColumnTargetError };