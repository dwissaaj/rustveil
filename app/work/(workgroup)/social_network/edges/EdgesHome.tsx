"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";

import EdgesTable from "./EdgesTable";
import EdgesGraph from "./EdgesGraph";

export default function EdgesHome() {
  const { theme } = useTheme();
  const [width, setWidth] = useState(500);
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

  return (
    <div className="flex w-full items-stretch">
      <div className="flex-shrink-0" style={{ width: `${width}px` }}>
        <EdgesTable />
      </div>

      <div
        className="flex items-center justify-center"
        style={{ marginLeft: "7px", marginRight: "7px", width: '5px' }}
      >
        <Button
          variant="light"
          color="primary"
          className="w-px max-w-px h-full cursor-grab rounded-lg transition-colors duration-200"
          onMouseDown={handleMouseDown}
          
        />
      </div>

      <div className="flex-1">
        <EdgesGraph />
      </div>
    </div>
  );
}
