import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";
import { selectedLang } from "./state";

export function useSentimentAnalysis() {
  const targetLang = useAtomValue(selectedLang);
  console.log(targetLang);
  const calculateSentiment = async () => {
    try {
      const response = await invoke("analyze_and_update_sentiment", {
        selectedLanguage: targetLang,
      });
      console.log(response);
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
  const targetLang = useAtomValue(selectedLang);
  console.log(targetLang);
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis_english");
      console.log(response);
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
