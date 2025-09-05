"use client";
import { useAtomValue } from "jotai";

import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import { centralityData, edgesData } from "@/app/lib/workstation/social/edges/state";
import { useGetCentrality } from "@/app/lib/workstation/social/calculate/useGetCentrality";
import { Button } from "@heroui/button";

import { addToast } from "@heroui/react";
import { useGetEdges } from "@/app/lib/workstation/social/edges/useGetNetwork";



export default function EdgesGraph() {
  const transformNivo = useGetEdges()
  const data = useAtomValue(edgesData);
  console.log(data);
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
      where is your data
      <Button onPress={handle}>click</Button>
    </div>
  )
}