"use client";

import CentralitySelectGraph from "./CentralitySelectGraph";
import { selectedChart, selectedCentrality } from "@/app/lib/workstation/social/centrality/state";
import { centralityData } from "@/app/lib/workstation/social/calculate/state";
import { useAtomValue } from "jotai";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { useTransformToPieData } from "@/app/lib/workstation/social/centrality/useTransformPie";
import { CentralityPieChart } from "./CentralityPieChart";

export default function CentralityHome() {
  const data = useAtomValue(centralityData);
  const chart = useAtomValue(selectedChart);
  const centrality = useAtomValue(selectedCentrality);
  const graphData = data?.graphData;

  console.log(graphData)
  return (
    <div className="max-h-screen">
      <div className="w-full flex flex-col gap-2">
        <div>
          <CentralitySelectGraph />
        </div>
        <div className="w-full h-full ">
          {chart === "pie" && (
            <CentralityPieChart graphData={graphData} centralityKey={centrality} />
          )}
          {chart === "bar" && (
 <div>
              bar {centrality}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
