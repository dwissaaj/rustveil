import { Chip } from "@heroui/react";
import React from "react";

export default function EdgesEmptyNetwork() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Chip color="warning">Calculate Centrality First to show graph</Chip>
    </div>
  );
}
