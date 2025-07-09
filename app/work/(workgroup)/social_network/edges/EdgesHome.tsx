import VertexTable from "@/components/workstation/sna/EdgesTable";
import { useAtomValue } from "jotai";
import React from "react";
import VerticesTable from "./EdgesTable";
import VerticesGraph from "./EdgesGraph";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";

export default function EdgesHome() {
  return (
    <div className="max-h-screen">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <VerticesTable
          />
        </div>
        <div>
          <VerticesGraph />
        </div>
      </div>
    </div>
  );
}
