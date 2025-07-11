"use client";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import EdgesTableViewer from "@/components/workstation/sna/edges/EdgesTableViewer";
import { Select, SelectItem, Chip } from "@heroui/react";

export default function EdgesTable() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useGraphData();

  return <EdgesTableViewer />;
}
