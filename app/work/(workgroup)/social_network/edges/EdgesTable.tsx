"use client";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import EdgesTableViewer from "@/components/workstation/sna/edges/EdgesTableViewer";

export default function EdgesTable() {
  const { vertex1, vertex2, vertex1Data, vertex2Data } = useGraphData();

  return (
    <EdgesTableViewer
      vertex1={vertex1}
      vertex2={vertex2}
      vertex1Data={vertex1Data}
      vertex2Data={vertex2Data}
    />
  );
}
