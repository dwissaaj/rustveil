import { NivoTransformTable } from "@/app/lib/workstation/nivo/NivoFormatTable";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { VerticesGraphViewerBar } from "@/components/workstation/sna/vertices/VerticesGraphViewerBar";

export default function VerticesGraph() {
  const { centralityValueData } = useGraphData();
  const nivoData = NivoTransformTable(centralityValueData);

  return <VerticesGraphViewerBar data={nivoData} />;
}
