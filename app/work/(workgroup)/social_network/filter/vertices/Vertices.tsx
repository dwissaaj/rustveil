import VertexTable from "@/components/workstation/sna/VertexTable";
import { useAtomValue } from "jotai";
import React from "react";
import VerticesTable from "./VerticesTable";
import VerticesGraph from "./VerticesGraph";

export default function Vertices() {
  return (
    <div className="grid grid-cols-2 gap-2 mt-10">
      <div>
        <VerticesTable />
      </div>
      <div>
        <VerticesGraph />
      </div>
    </div>
  );
}
