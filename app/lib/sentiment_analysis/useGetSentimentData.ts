import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";

import { InvokeResponse } from "@/app/lib/data/response";
import { columnTargetSentimentAnalysis } from "@/app/lib/sentiment_analysis/state";

export function useGetSentimentDataTarget() {
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);
  const getTargetData = async (page: number = 1, pageSize: number = 100) => {
    try {
      const response = await invoke<InvokeResponse>(
        "get_paginated_sentiment_target",
        {
          pagination: {
            page: page,
            page_size: pageSize,
          },
          target: {
            column_target: columnTarget,
          },
        },
      );

      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          data: response.Success.data,
          total_count: response.Success.total_count,
          total_negative_data: response.Success.total_negative_data,
          total_positive_data: response.Success.total_positive_data,
        };
      } else if ("Error" in response) {
        return {
          response_code: response.Error.response_code,
          message: response.Error.message,
        };
      }
    } catch (error) {
      return {
        response_code: 500,
        message: `Error at hook get sentiment data ${error}`,
      };
    }
  };

  return getTargetData;
}
