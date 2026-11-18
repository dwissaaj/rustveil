import { Button, Tooltip } from "@heroui/react";
import React from "react";

export default function NoSentimentData() {
  return (
    <div className="min-w-full min-h-full flex justify-center items-center text-black/80">
      <Tooltip color="secondary" content="Try to calculate or refresh page">
        <Button className="capitalize" color="warning" variant="flat">
          No Data Sentiment
        </Button>
      </Tooltip>
    </div>
  );
}
