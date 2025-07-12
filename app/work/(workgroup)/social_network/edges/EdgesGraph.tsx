"use client";
import { useNetworkData } from "@/app/lib/workstation/nivo/NivoNetworkFormat";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
export default function EdgesGraph() {
  const { centralityValueData, vertex1Data, vertex2Data } = useGraphData();
  const networkData = useNetworkData(
    centralityValueData,
    vertex1Data,
    vertex2Data,
  );
  return <EdgesGraphNetwork data={networkData} />;
}
