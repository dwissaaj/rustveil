import EnglishModelInfo from "./info/EnglishModelInfo";
import IndoModelInfo from "./info/IndoModelInfo";
import AsianModelInfo from "./info/AsianModelInfo";
import EuropeModelInfo from "./info/EuropeModelInfo";

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
  id: "cahya/bert-base-indonesian-sentiment",
  de: "nlptown/bert-base-multilingual-uncased-sentiment",
  es: "nlptown/bert-base-multilingual-uncased-sentiment",
  fr: "nlptown/bert-base-multilingual-uncased-sentiment",
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
  "cahya/bert-base-indonesian-sentiment": IndoModelInfo,
  "ltabularisai/multilingual-sentiment-analysis": AsianModelInfo,
  "nlptown/bert-base-multilingual-uncased-sentiment": EuropeModelInfo,
  default: AsianModelInfo,
};
