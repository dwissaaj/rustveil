import { columnAvailable } from "@/app/lib/data/state";
import { columnTargetSentimentAnalysis } from "@/app/lib/sentiment_analysis/state";
import { Select, SelectItem } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";

export default function ListColumn() {
  const [column] = useAtom(columnAvailable);
  const [textTargetSentiment, setTextTargetSentiment] = useAtom(
    columnTargetSentimentAnalysis
  );
  return (
    <div className="flex flex-col gap-2 items-start">
      <Select
        className="max-w-xl"
        label="Target Contain Text"
        placeholder="Choose a column"
        variant="underlined"
        color="primary"
        labelPlacement="inside"
        value={textTargetSentiment}
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
