"use client";
import { useAtomValue } from "jotai";

import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import { graphDataAtom } from "@/app/lib/workstation/social/edges/dto";

export default function EdgesGraph() {
  // Get the complete graph data from Jotai
  const graphData = useAtomValue(graphDataAtom);

  // Show loading or error states
  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">No graph data available. Please calculate centrality first.</div>
      </div>
    );
  }

  // Prepare data for the graph component
  const networkData = {
    nodes: graphData.nodes,
    links: graphData.links
  };

  return <EdgesGraphNetwork data={networkData} />;
}