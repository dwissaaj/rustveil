import VertexTable from "@/components/workstation/sna/VertexTable";
import { useAtomValue } from "jotai";
import React from "react";
import VerticesTable from "./VerticesTable";
import VerticesGraph from "./VerticesGraph";
import { useColumnShow } from "@/app/lib/workstation/social/GetColumn";

export default function Vertices() {
 const { headers, vertex1, setVertex1, vertex2, setVertex2 , vertex1Data, vertex2Data} = useColumnShow();
  return (
    <div className="max-h-screen">
      <div className="grid grid-cols-2 gap-2 mt-10">
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
