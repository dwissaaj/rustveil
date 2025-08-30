import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import React from "react";
import { Select, SelectItem, Chip } from "@heroui/react";
import { useAtom } from "jotai";
import { columnAvailable } from "@/app/lib/workstation/data/state";
export default function EdgesSelection() {

  const [ columnPick,setColumnAvailable] = useAtom(columnAvailable);

  return (
    <>
      <div className="flex flex-row gap-4 ">
        
      </div>
      <div className="flex flex-row gap-2 mb-4">
      
      </div>
    </>
  );
}
