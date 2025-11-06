export interface ResponseSuccess {
  response_code: number;
  message: string;
  data: Record<string, any>[];
  total_count?: number;
  total_negative_data?: number;
  total_positive_data?: number;
  target_vertex_1?: string;
  target_vertex_2?: string;
  graph_type?: string;
  target_social_network_updatedat?: string;
  target_sentiment_analysis_updatedat?: string;
  target_sentiment_column?: string;
  target_language_column?: string;
}

export interface ResponseError {
  response_code: number;
  message: string;
}

export type InvokeResponse =
  | { Success: ResponseSuccess }
  | { Error: ResponseError };
