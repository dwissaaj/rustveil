import EnglishModelInfo from "../../sentiment_analysis/modal/info/EnglishModelInfo";
import IndoModelInfo from "../../sentiment_analysis/modal/info/IndoModelInfo";
import MultiLangModelInfo from "../../sentiment_analysis/modal/info/MultiLangModelInfo";

export const supportedLang = [
  { key: "en", label: "English" },
  { key: "id", label: "Indonesia" },
  { key: "de", label: "German" },
  { key: "es", label: "Spanish" },
  { key: "fr", label: "French" },
  { key: "jp", label: "Japanese" },
  { key: "zh", label: "Chinese" },
  { key: "ko", label: "Korean" },
  { key: "vi", label: "Vietnamese" },
  { key: "tl", label: "Tagalog" },
  { key: "ms", label: "Malay" },
  { key: "ar", label: "Arabic" },
];
export const modelMap: Record<string, string> = {
  en: "distilbert-base-uncased-finetuned-sst-2-english",
  id: "agufsamudra/indo-sentiment-analysis",
  de: "tabularisai/multilingual-sentiment-analysis",
  es: "tabularisai/multilingual-sentiment-analysis",
  fr: "tabularisai/multilingual-sentiment-analysis",
  jp: "tabularisai/multilingual-sentiment-analysis",
  zh: "tabularisai/multilingual-sentiment-analysis",
  ko: "tabularisai/multilingual-sentiment-analysis",
  vi: "tabularisai/multilingual-sentiment-analysis",
  tl: "tabularisai/multilingual-sentiment-analysis",
  ms: "tabularisai/multilingual-sentiment-analysis",
  ar: "tabularisai/multilingual-sentiment-analysis",
  default: "tabularisai/multilingual-sentiment-analysis",
};
export const modelComponents: Record<string, React.FC> = {
  "distilbert-base-uncased-finetuned-sst-2-english": EnglishModelInfo,
  "agufsamudra/indo-sentiment-analysis": IndoModelInfo,
  "tabularisai/multilingual-sentiment-analysis": MultiLangModelInfo,
  default: MultiLangModelInfo,
};
