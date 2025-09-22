import { invoke } from "@tauri-apps/api/core";

export function useSentimentAnalysis() {
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis", {});
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
