"use client";
import { useAtomValue } from "jotai";

import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import { centralityData, edgesData } from "@/app/lib/workstation/social/edges/state";
import { useGetCentrality } from "@/app/lib/workstation/social/calculate/useGetCentrality";
import { Button } from "@heroui/button";
import { useTransformNivo } from "@/app/lib/workstation/social/edges/useTransformNivo";
import { addToast } from "@heroui/react";



export default function EdgesGraph() {
  const transformNivo = useTransformNivo()
  const data = useAtomValue(edgesData);
  console.log(data);
  const handle = async () => {
  try {
    const result = await transformNivo();
    if (result?.response_code === 200) {
      addToast({
        title: "Success",
        description: `${result?.message}`,
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
      description: `${error}`,
      color: "danger",
    });
  }
};
  const getNivoData = useNivoGraphData();
  const nivoData = getNivoData();
  return (
    <div>
     
      <Button onPress={handle}>click</Button>
      <div>
        
      </div>
    </div>
  )
}