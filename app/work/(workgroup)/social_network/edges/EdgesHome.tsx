"use client";
import React, { useState } from "react";
import EdgesTable from "./EdgesTable";
import { useTheme } from "next-themes";
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
      <div style={{ width: `${width}px` }} className="flex-shrink-0">
        <EdgesTable />
      </div>

      <div
        className="flex items-center justify-center"
        style={{ marginLeft: "7px", marginRight: "7px" }}
      >
        <div
          className="w-2 cursor-grab rounded-lg transition-colors duration-200"
          onMouseDown={handleMouseDown}
          style={{
            height: "75%",
            backgroundColor: theme === "dark" ? "#444" : "#e5e7eb",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === "dark" ? "#888" : "#9ca3af";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === "dark" ? "#444" : "#e5e7eb";
          }}
        />
      </div>

      <div className="flex-1">
        <EdgesGraph />
      </div>
    </div>
  );
}
