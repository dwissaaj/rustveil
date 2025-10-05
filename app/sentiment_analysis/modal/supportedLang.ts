import EnglishModelInfo from "./info/EnglishModelInfo";
import IndoModelInfo from "./info/IndoModelInfo";
import MultiLangInfo from "./info/MultiLangInfo";
import NlpMultiInfo from "./info/NlpMultiInfo";

export const supportedLang = [
  { key: "en", label: "English" },
  { key: "id", label: "Indonesia" },
  { key: "jp", label: "Japanese" },
  { key: "es", label: "Spanish" },
  { key: "zh", label: "Chinese" },
  { key: "ko", label: "Korean" },
  { key: "ms", label: "Malay" },
  { key: "ar", label: "Arabic" },
  { key: "de", label: "German" },
  { key: "vi", label: "Vietnamese" },
  { key: "tl", label: "Tagalog" },
];
export const modelMap: Record<string, string> = {
  en: "distilbert-base-uncased-finetuned-sst-2-english",
  id: "cahya/bert-base-indonesian-sentiment",
  jp: "lxyuan/distilbert-base-multilingual-cased-sentiments-student",
  zh: "lxyuan/distilbert-base-multilingual-cased-sentiments-student",
  ko: "lxyuan/distilbert-base-multilingual-cased-sentiments-student",
  ms: "lxyuan/distilbert-base-multilingual-cased-sentiments-student",
  ar: "lxyuan/distilbert-base-multilingual-cased-sentiments-student",
  de: "nlptown/bert-base-multilingual-uncased-sentiment",
  es: "nlptown/bert-base-multilingual-uncased-sentiment",
  vi: "tabularisai/multilingual-sentiment-analysis",
  tl: "tabularisai/multilingual-sentiment-analysis",
  default: "tabularisai/multilingual-sentiment-analysis",
};
export const modelComponents: Record<string, React.FC> = {
  "distilbert-base-uncased-finetuned-sst-2-english": EnglishModelInfo,
  "cahya/bert-base-indonesian-sentiment": IndoModelInfo,
  "lxyuan/distilbert-base-multilingual-cased-sentiments-student": MultiLangInfo,
  "nlptown/bert-base-multilingual-uncased-sentiment": NlpMultiInfo,
  default: EnglishModelInfo,
};