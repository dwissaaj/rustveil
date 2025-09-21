"use client";

import TargetFilter from "./TargetFilter";

export default function SentimentAnalysisFilterWrapper() {
  return (
    <>
      <div className="flex flex-row gap-2">
        <div>
          <TargetFilter />
        </div>
        
      </div>
    </>
  );
}
