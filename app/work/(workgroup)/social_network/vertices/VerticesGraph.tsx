import { NivoTransformTable } from "@/app/lib/NivoFormatTable";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { VerticesGraphViewer } from "@/components/workstation/sna/VerticesGraphViewer";
import React from "react";

export default function VerticesGraph() {
  const { graphData } = useGraphData();
  const nivoData = NivoTransformTable(graphData);
  return <VerticesGraphViewer data={nivoData} />;
}
