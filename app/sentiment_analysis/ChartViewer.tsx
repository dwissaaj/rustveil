import React from "react";
import { SentimentPieChart } from "./PieViewer";
import { useAtom, useAtomValue } from "jotai";
import {
  PieSentimentFilterState,
  sentimentCountData,
} from "../lib/sentiment_analysis/state";

export default function ChartViewer() {
  const totalCountData = useAtomValue(sentimentCountData);
  const chartFilter = useAtomValue(PieSentimentFilterState);
  const senData = [
    {
      id: "positive",
      label: "Positive",
      value: totalCountData.total_positive_data,
    },
    {
      id: "negative",
      label: "Negative",
      value: totalCountData.total_negative_data,
    },
  ];
  console.log(senData)
  return (
    <div className="w-full h-[75vh] p-2">
      <SentimentPieChart data={senData} chartFilter={chartFilter} />
    </div>
  );
}
