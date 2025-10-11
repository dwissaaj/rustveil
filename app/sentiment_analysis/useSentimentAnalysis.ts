import { invoke } from "@tauri-apps/api/core";

export function useSentimentAnalysis() {
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis_indonesia", {});
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


export function useSentimentAnalysisMulti() {
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis_multilanguage", {});
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
export function useSentimentAnalysisEng() {
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis_english", {});
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

export function useSentimentAnalysisDefault() {
  const calculateSentiment = async () => {
    try {
      const response = await invoke("calculate_sentiment_analysis_default", {});
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
