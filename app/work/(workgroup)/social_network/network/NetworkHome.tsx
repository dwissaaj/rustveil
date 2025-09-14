"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";

import EdgesTable from "./NetworkTable";
import NetworkGraph from "./NetworkGraph";

export default function NetworkHome() {
  const { theme } = useTheme();
  const [width, setWidth] = useState(500);
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const viewportWidth = window.innerWidth; // total width
      const maxWidth = viewportWidth - 100; // leave at least 100px for the graph

      let newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth < 100) newWidth = 100; // min width
      if (newWidth > maxWidth) newWidth = maxWidth; // max width

      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex w-full max-w-screen max-h-full items-stretch">
      <div
        className="flex-shrink-0 max-w-[75%] " // max width 80% of parent
        style={{ width: `${width}px` }}
      >
        <EdgesTable />
      </div>

      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ marginLeft: "7px", marginRight: "7px", width: "5px" }}
      >
        <button
          onMouseDown={handleMouseDown}
          className={`
            w-full h-full rounded transition-colors duration-200
            ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} 
            hover:opacity-100 opacity-40 transition-200
          `}
        ></button>
      </div>

      <div className="flex-1 max-h-full">
        <NetworkGraph />
      </div>
    </div>
  );
}
