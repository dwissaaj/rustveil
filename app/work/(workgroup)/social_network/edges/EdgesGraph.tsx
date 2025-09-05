"use client";
import { useAtomValue } from "jotai";

import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import { centralityData } from "@/app/lib/workstation/social/edges/dto";
import { useGetCentrality } from "@/app/lib/workstation/social/vertex/useGetCentrality";
import { Button } from "@heroui/button";



export default function EdgesGraph() {
  // Get the complete graph data from Jotai
  const graphData = useAtomValue(centralityData);
  const getcen = useGetCentrality();
  const fetchData = async () => {     
    try {
      const response = await getcen();
      console.log(response)
    } catch (error) {
      console.log(error)
    }

  }
  // Show loading or error states
  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">No graph data available. Please calculate centrality first.</div>
        <Button onPress={fetchData}>cilck</Button>
      </div>
    );
  }

  // Prepare data for the graph component
  // const networkData = {
  //   nodes: graphData.nodes,
  //   links: graphData.links
  // };

  // return <EdgesGraphNetwork data={networkData} />;
  return (
    <div>
      where is your data
    </div>
  )
}