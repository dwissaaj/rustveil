import { InfoIconSolid } from "@/components/icon/IconView";
import { Chip } from "@heroui/react";
import React from "react";

export default function EdgesEmptyNetwork() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Chip startContent={<InfoIconSolid />} color="warning">Calculate Centrality First to show Graph</Chip>
    </div>
  );
}
