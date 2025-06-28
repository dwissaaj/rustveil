"use client";

import { useColumnShow } from "@/app/lib/workstation/social/GetColumn";
import VertexTable from "@/components/workstation/sna/VertexTable";
import { Select, SelectItem, Chip } from "@heroui/react";

export default function VerticesGraph() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useColumnShow();

  return <div className="space-y-4">grapg</div>;
}
