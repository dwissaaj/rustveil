'use client'
import React, { useState } from "react";
import EdgesTable from "./EdgesTable";

import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { useNetworkData } from "@/app/lib/workstation/nivo/NivoNetworkFormat";
import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
import EdgesEmptyNetwork from "@/components/workstation/sna/edges/EdgesEmptyNetwork";
import { useTheme } from "next-themes";
import EdgesGraph from "./EdgesGraph";
export default function EdgesHome() {
  const { theme } = useTheme();
  const barColor = theme === "dark" ? "bg-secondary" : "bg-primary";
  const [width, setWidth] = useState(500); // start with 300px

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setWidth(newWidth > 100 ? newWidth : 100); 
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };


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
    return <EdgesGraph />;
  };

  return (

    <div className="flex max-h-screen w-full ">
      <div className="" style={{ width: `${width}px` }}>
        <EdgesTable />
      </div>
      <div
        className={`w-2 cursor-grab ${barColor} rounded-lg`}
        onMouseDown={handleMouseDown}
        style={{marginLeft: '7px', marginRight: '7px'}}
      />
      
      <div className="flex-1 ">
        < EdgesGraph />
      </div>
    </div>
  );
}
