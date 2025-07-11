import { VerticesGraphViewerPie } from "@/components/workstation/sna/vertices/VerticesGraphViewerPie";
import VerticesGraph from "./VerticesGraph";
import VerticesTable from "./VerticesTable";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {
  Select,
  SelectedItemProps,
  SelectItem,
  SharedSelection,
} from "@heroui/react";
import { VerticesGraphViewerBar } from "@/components/workstation/sna/vertices/VerticesGraphViewerBar";

import { useState } from "react";
import { NivoTransformTable } from "@/app/lib/workstation/nivo/NivoFormatTable";

export default function VerticesHome() {
  const { centralityValueData } = useGraphData();
  const nivoData = NivoTransformTable(centralityValueData);
  const [selectedChartType, setSelectedChartType] = useState<string>("bar");
  console.log(centralityValueData)
  const renderChart = () => {
    switch (selectedChartType) {
      case "pie":
        return <VerticesGraphViewerPie data={centralityValueData} />;
      case "bar":
        return <VerticesGraphViewerBar data={nivoData} />;
      default:
        return <VerticesGraphViewerBar data={nivoData} />;
    }
  };
  return (
    <div className="max-h-screen">
      <div className="w-full flex flex-col gap-2">
        <div className="m-2 w-1/2 ">
          <Select
            label="Select Chart Type"
            defaultSelectedKeys={"bar"}
            variant="underlined"
            className=""
            onSelectionChange={(selectedKeys: SharedSelection) =>
              setSelectedChartType(selectedKeys.currentKey as string)
            }
          >
            <SelectItem key={"pie"}>Pie</SelectItem>
            <SelectItem key={"bar"}>Bar</SelectItem>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-10">
          <div>
            <VerticesTable />
          </div>
          <div className="w-full h-full p-4 m-4">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
}
