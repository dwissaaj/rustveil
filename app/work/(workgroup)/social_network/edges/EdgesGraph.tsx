"use client";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useGetEdges } from "@/app/lib/workstation/social/edges/useGetNetwork";
import EdgesGraphNetwork from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import { useAtomValue } from "jotai";
import { NetworkGraphData } from "@/app/lib/workstation/social/edges/state";

export default function EdgesGraph() {
  const transformNivo = useGetEdges()
  const edgesdata = useAtomValue(NetworkGraphData)
  console.log(edgesdata)
  const handle = async () => {
  try {
    const result = await transformNivo();
    if (result?.response_code === 200) {
  addToast({
    title: "Success",
    description: result.message,
    color: "success",
  });
} else {
  addToast({
    title: "Error at Fetch",
    description: `${result?.message}`,
    color: "danger",
  });
}
  } catch (error) {
    addToast({
      title: "Error",
      description: String(error),
      color: "danger",
    });
  }
};

  return (
    <div>
      <div>
      <Button onPress={handle}>Fetch and Transform Edges</Button>
      </div>
      <div>
    
      <EdgesGraphNetwork />
      </div>
    </div>
  )
}