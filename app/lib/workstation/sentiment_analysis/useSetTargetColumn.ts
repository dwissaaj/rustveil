import { invoke } from "@tauri-apps/api/core";
import { ColumnTargetSelectedResult } from "./response";
import { useAtomValue } from "jotai";
import { columnTargetSentimentAnalysis } from "@/app/lib/workstation/data/state";

export function useSetTargetColumn() {
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis)
  const setTargetColumn = async () => {
    try {
      const response = await invoke<ColumnTargetSelectedResult>("set_sentiment_analysis_target_column" ,{
        target:  {
          column_target : columnTarget
        }
      });
      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          target: response.Success.target
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
