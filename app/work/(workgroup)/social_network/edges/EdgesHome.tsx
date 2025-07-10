import { useAtomValue } from "jotai";
import React from "react";
import EdgesTableViewer from "@/components/workstation/sna/EdgesTableViewer";
import EdgesGraph from "./EdgesGraph";
import EdgesTable from "./EdgesTable";

export default function EdgesHome() {
  return (
    <div className="max-h-screen">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <EdgesTable />
        </div>
        <div>
          <EdgesGraph />
        </div>
      </div>
    </div>
  );
}
