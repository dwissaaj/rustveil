import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { VerticesTableViewer } from "@/components/workstation/sna/vertices/VerticesTableViewer";

import React, { use } from "react";

export default function VerticesTable() {
  const { graphData } = useGraphData();
  return <VerticesTableViewer vertices={graphData} />;
}
