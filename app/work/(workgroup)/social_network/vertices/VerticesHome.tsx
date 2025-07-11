import { VerticesGraphViewerPie } from "@/components/workstation/sna/vertices/VerticesGraphViewerPie";
import VerticesGraph from "./VerticesGraph";
import VerticesTable from "./VerticesTable";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";

export default function VerticesHome() {
  const {graphData} = useGraphData()
  return (
    <div className="max-h-screen">
      <div className="grid grid-cols-2 gap-2 mt-10">
        <div>
          <VerticesTable />
        </div>
        <div className="w-full h-full p-4 m-4">
          <VerticesGraphViewerPie data={graphData} />
        </div>
      </div>
    </div>
  );
}
