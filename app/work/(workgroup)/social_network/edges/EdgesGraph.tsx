"use client";

import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import VertexTable from "@/components/workstation/sna/EdgesTable";
import { Select, SelectItem, Chip } from "@heroui/react";

export default function EdgesGraph() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useGraphData();

  return <div className="space-y-4">grapg</div>;
}
