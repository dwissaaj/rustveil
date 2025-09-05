'use client';
import { VerticesGraphViewerPie } from "@/components/workstation/sna/vertices/VerticesGraphViewerPie";
import VerticesTable from "./VerticesTable";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { Select, SelectItem, SharedSelection } from "@heroui/react";
import { VerticesGraphViewerBar } from "@/components/workstation/sna/vertices/VerticesGraphViewerBar";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { centralityData } from "@/app/lib/workstation/social/edges/state";



export default function VerticesHome() {


    const [graphData] = useAtom(centralityData);
  
  useEffect(() => {
    console.log("Graph data updated:", graphData);
  }, [graphData]);
  return (
    <div className="max-h-screen">
      <div className="w-full flex flex-col gap-2">
        <div className="m-2 w-1/2 ">
          {/* <Select
            label="Select Chart Type"
            defaultSelectedKeys={"bar"}
            variant="underlined"
            className=""
            
          >
            <SelectItem key={"pie"}>Pie</SelectItem>
            <SelectItem key={"bar"}>Bar</SelectItem>
          </Select> */}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-10">
          <div>
          asdsas
          </div>
        
        </div>
      </div>
    </div>
  );
}
