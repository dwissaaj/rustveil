import { Select, SelectItem } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";

import { columnTargetSentimentAnalysis } from "@/app/lib/sentiment_analysis/state";
import { columnAvailable } from "@/app/lib/data/state";

export default function ListColumn() {
  const [column] = useAtom(columnAvailable);
  const [textTargetSentiment, setTextTargetSentiment] = useAtom(
    columnTargetSentimentAnalysis,
  );

  return (
    <div className="flex flex-col gap-2 items-start">
      <Select
        className="max-w-xl"
        color="primary"
        label="Target Contain Text"
        labelPlacement="inside"
        placeholder="Choose a column"
        value={textTargetSentiment}
        variant="underlined"
        onChange={(event) => {
          const value = event.target.value;

          setTextTargetSentiment(value);
        }}
      >
        {column.map((col) => (
          <SelectItem key={col}>{col}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
