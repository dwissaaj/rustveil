import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { VerticesTableViewer } from "@/components/workstation/sna/vertices/VerticesTableViewer";

import React from "react";

export default function VerticesTable() {
  const { centralityValueData } = useGraphData();
  return <VerticesTableViewer vertices={centralityValueData} />;
}
