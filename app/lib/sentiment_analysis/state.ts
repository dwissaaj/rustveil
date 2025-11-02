import { ColorSchema } from "@/app/social_network/centrality/state";
import { atom } from "jotai";

export const selectedLang = atom<string>("");
export const columnTargetSentimentAnalysis = atom<string>("");

export interface SentimentCount {
  total_count: number;
  total_negative_data: number;
  total_positive_data: number;
}

export const sentimentCountData = atom<SentimentCount>({
  total_count: 0,
  total_negative_data: 0,
  total_positive_data: 0,
});
export const sentimentData = atom<Record<string, any>[]>([]);
export const sentimentViewerPage = atom<number>(1);

export const showFilterAtom = atom(false);

export interface PieSentimentStateType {
  innerRadius: number;
  padAngle: number;
  cornerRadius: number;
  colorSchema: ColorSchema;
  title: string;
  description: string;
  author: string;
  labelsOffset: number;
  textOffset: number;
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  startAngle: number;
  endAngle: number;
  labelSkip: number;
  labelDiagonalLength: number;
  labelStraightLength: number;
}

export const PieSentimentFilterState = atom<PieSentimentStateType>({
  innerRadius: 0.5,
  padAngle: 1,
  labelsOffset: 0,
  textOffset: 0,
  cornerRadius: 0,
  topMargin: 50,
  bottomMargin: 50,
  leftMargin: 50,
  rightMargin: 50,
  colorSchema: ColorSchema.nivo,
  title: "My Chart",
  description: "Description",
  author: "Your Name",
  startAngle: 0,
  endAngle: 360,
  labelSkip: 0,
  labelDiagonalLength: 16,
  labelStraightLength: 24,
});

export interface PieSentimentType {
  id: string;
  value: number;
  label?: string;
}

export const showFilterSentiment = atom(false);
