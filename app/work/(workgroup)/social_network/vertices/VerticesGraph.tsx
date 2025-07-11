import { NivoTransformTable } from "@/app/lib/NivoFormatTable";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { VerticesGraphViewerBar } from "@/components/workstation/sna/vertices/VerticesGraphViewerBar";

import React from "react";

export default function VerticesGraph() {
  const { graphData } = useGraphData();
  const nivoData = NivoTransformTable(graphData);
  return <VerticesGraphViewerBar data={nivoData} />;
}
