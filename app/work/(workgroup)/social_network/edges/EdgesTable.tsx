"use client";

import VertexTableViewer from "@/components/workstation/sna/edges/EdgesTableViewer";
import { useRefreshServer } from "@/app/lib/workstation/data/handler/server/useRefreshServer";
import { useAtom } from "jotai";
import { currentPageTable, dataTable, loadingTable, totalCountTable } from "@/app/lib/workstation/data/state";
export default function EdgesTable() {

  return (
    <VertexTableViewer
         
    />
  );
}
