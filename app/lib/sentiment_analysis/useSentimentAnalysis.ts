import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";

import { selectedLang } from "./state";
import { SentimentAnalysisResult } from "./response";

export function useSentimentAnalysis() {
  const targetLang = useAtomValue(selectedLang);

  const calculateSentiment = async () => {
    try {
      const response = await invoke<SentimentAnalysisResult>("analyze_and_update_sentiment", {
        selectedLanguage: targetLang,
      });

      if ("Success" in response) {
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
            total_data: response.Success.total_data,
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
        message: `Error at hook Analyze sentiment ${error}`,
      };
    }
  };

  return calculateSentiment;
}
