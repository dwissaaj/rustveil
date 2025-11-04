import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";

import { ColumnTargetSelectedResult } from "./response";

import { columnTargetSentimentAnalysis } from "@/app/lib/sentiment_analysis/state";

export function useSetTargetColumn() {
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);
  const setTargetColumn = async () => {
    try {
      const response = await invoke<ColumnTargetSelectedResult>(
        "set_sentiment_analysis_target_column",
        {
          target: {
            column_target: columnTarget,
          },
        },
      );
      console.log(response)
      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          target: response.Success.target,
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
        message: `Error at hook set target column ${error}`,
      };
    }
  };

  return setTargetColumn;
}
