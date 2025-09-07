"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";

import { centralityData } from "@/app/lib/workstation/social/network/state";
import { SelectItem, Select } from "@heroui/react";


export default function CentralityHome() {
  const [graphData] = useAtom(centralityData);

  useEffect(() => {}, [graphData]);

  return (
    <div className="max-h-screen">
      <div className="w-full flex flex-col gap-2">
        <div className="m-2 w-1/2 ">
          <Select
            label="Select Chart Type"
            defaultSelectedKeys={"bar"}
            variant="underlined"
            className=""
            
          >
            <SelectItem key={"pie"}>Pie</SelectItem>
            <SelectItem key={"bar"}>Bar</SelectItem>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-10">
          asd
        </div>
      </div>
    </div>
  );
}
