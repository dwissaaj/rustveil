"use client";


import {
  selectedChart,
  selectedCentrality,
} from "@/app/lib/workstation/social/centrality/state";
import { centralityData } from "@/app/lib/workstation/social/calculate/state";
import { useAtomValue } from "jotai";
import { CentralityPieChart } from "./CentralityPieChart";
import { CentralityBarChart } from "./CentralityBarChart";
import CentralitySelectGraph from "@/components/sna/centrality/CentralitySelectGraph";

export default function ChartHome() {
  const data = useAtomValue(centralityData);
  const chart = useAtomValue(selectedChart);
  const centrality = useAtomValue(selectedCentrality);
  const graphData = data?.graphData;

  return (
    <div className="max-h-screen">
      <div className="w-full flex flex-col gap-2">
        <div>
          <CentralitySelectGraph />
        </div>
        <div className="w-full h-full ">
          {chart === "pie" && (
            <CentralityPieChart
              graphData={graphData}
              centralityKey={centrality}
            />
          )}
          {chart === "bar" && (
            <div>
              <CentralityBarChart
                graphData={graphData}
                centralityKey={centrality}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
