"use client";

import TargetSentimentFilter from "./TargetSentimentFilter";

export default function SentimentAnalysisFilterWrapper() {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <TargetSentimentFilter />
      </div>
      <div></div>
    </div>
  );
}
