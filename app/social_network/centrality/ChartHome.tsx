"use client";

import { useAtomValue } from "jotai";

import { CentralityPieChart } from "./CentralityPieChart";
import { CentralityBarChart } from "./CentralityBarChart";

import { centralityData } from "@/app/lib/workstation/social/calculate/state";
import {
  selectedChart,
  selectedCentrality,
} from "@/app/lib/workstation/social/centrality/state";
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
              centralityKey={centrality}
              graphData={graphData}
            />
          )}
          {chart === "bar" && (
            <div>
              <CentralityBarChart
                centralityKey={centrality}
                graphData={graphData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
