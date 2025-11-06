import { invoke } from "@tauri-apps/api/core";
import { useAtomValue, useSetAtom } from "jotai";

import { ColumnTargetSelectedResult } from "./response";

import { columnTargetSentimentAnalysis, selectedLang, targetSentimentCreatedAt } from "@/app/lib/sentiment_analysis/state";

export function useSetTargetColumn() {
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);
  const languageTarget = useAtomValue(selectedLang);
    const setVerticesCreatedAt = useSetAtom(targetSentimentCreatedAt)

  const setTargetColumn = async () => {
    try {
          const now = new Date().toISOString();
      const response = await invoke<ColumnTargetSelectedResult>(
        "set_sentiment_analysis_target_column",
        {
          target: {
            column_target: columnTarget,
            language_target: languageTarget
          },
        },
      );
      setVerticesCreatedAt(now)
      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          column_target: response.Success.column_target,
          languageTarget: response.Success.language_target
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
