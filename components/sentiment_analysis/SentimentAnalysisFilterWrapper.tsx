"use client";

import TargetSentimentFilter from "./TargetSentimentFilter";

export default function SentimentAnalysisFilterWrapper() {
  return (
    <>
      <div className="flex flex-row gap-2">
        <div>
          <TargetSentimentFilter />
        </div>
        
      </div>
    </>
  );
}
