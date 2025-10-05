export const modelDescriptions: Record<
  string,
  { title: string; desc: string; url?: string }
> = {
  "distilbert-base-uncased-finetuned-sst-2-english": {
    title: "DistilBERT (English)",
    desc: "Trained on SST-2 dataset, supports binary classification (Positive/Negative).",
    url: "https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english",
  },
  "cahya/bert-base-indonesian-sentiment": {
    title: "IndoBERT (Cahya)",
    desc: "Finetuned for Indonesian sentiment classification with 3 classes (Positive, Negative, Neutral).",
    url: "https://huggingface.co/cahya/bert-base-indonesian-sentiment",
  },
  "lxyuan/distilbert-base-multilingual-cased-sentiments-student": {
    title: "DistilBERT Multilingual Student",
    desc: "Covers East Asian + Arabic languages. Outputs multiple sentiment labels (Positive/Negative/Neutral).",
    url: "https://huggingface.co/lxyuan/distilbert-base-multilingual-cased-sentiments-student",
  },
  "nlptown/bert-base-multilingual-uncased-sentiment": {
    title: "BERT Multilingual (Europe)",
    desc: "Finetuned for product reviews in 6 languages (English, Dutch, German, French, Spanish, Italian). Outputs 1–5 stars.",
    url: "https://huggingface.co/nlptown/bert-base-multilingual-uncased-sentiment",
  },
  "tabularisai/multilingual-sentiment-analysis": {
    title: "TabularisAI Multilingual Sentiment",
    desc: "Fallback model for unsupported languages. Covers a wide range of text in multiple languages.",
    url: "https://huggingface.co/tabularisai/multilingual-sentiment-analysis",
  },
};