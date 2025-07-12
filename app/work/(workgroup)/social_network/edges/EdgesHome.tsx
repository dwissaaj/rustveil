import React from "react";
import EdgesTable from "./EdgesTable";

import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { useNetworkData } from "@/app/lib/workstation/nivo/NivoNetworkFormat";
import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import EdgesEmptyNetwork from "@/components/workstation/sna/edges/EdgesEmptyNetwork";
import EdgesSelection from "@/components/workstation/sna/edges/EdgesSelection";
export default function EdgesHome() {
  const { centralityValueData, vertex1Data, vertex2Data } = useGraphData();
  const networkData = useNetworkData(
    centralityValueData,
    vertex1Data,
    vertex2Data,
  );
  const renderNetworkGraph = () => {
    if (networkData.nodes.length === 0) {
      return <EdgesEmptyNetwork />;
    }
    return <EdgesGraphNetwork data={networkData} />;
  };

  return (
    <div className="max-h-screen">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-1/2 gap-4 space-y-6">
          <EdgesSelection />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <EdgesTable />
        </div>
        <div>{renderNetworkGraph()}</div>
      </div>
    </div>
  );
}
