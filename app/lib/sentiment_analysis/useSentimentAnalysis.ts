import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";

import { selectedLang } from "./state";

export function useSentimentAnalysis() {
  const targetLang = useAtomValue(selectedLang);

  const calculateSentiment = async () => {
    try {
      const response = await invoke("analyze_and_update_sentiment", {
        selectedLanguage: targetLang,
      });

      return response;
    } catch (error) {
      return {
        response_code: 500,
        message: `Error at hook set target column ${error}`,
      };
    }
  };

  return calculateSentiment;
}

export function useSentimentTest() {
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis_english");

      return response;
    } catch (error) {
      return {
        response_code: 500,
        message: `Error at hook set target column ${error}`,
      };
    }
  };

  return calculateSentiment;
}
