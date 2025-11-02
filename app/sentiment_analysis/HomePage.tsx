"use client";

import { useTheme } from "next-themes";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import ColumnViewerTable from "./ColumnViewer";
import ChartViewer from "./ChartViewer";

import SentimentAnalysisFilterWrapper from "@/components/sentiment_analysis/SentimentAnalysisFilterWrapper";

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div>
        <SentimentAnalysisFilterWrapper />
      </div>
      <div>
        <PanelGroup
          autoSaveId="panel sna"
          className="flex gap-2 w-full max-w-screen max-h-full items-stretch"
          direction="horizontal"
        >
          <Panel defaultSize={50}>
            <div className="max-h-[85vh]">
              <ColumnViewerTable />
            </div>
          </Panel>
          <PanelResizeHandle
            className={`w-2 m-2 ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} rounded transition-colors duration-200 hover:opacity-100 opacity-40 transition-200`}
          />
          <Panel defaultSize={50}>
            <div className="max-h-[85vh] mt-2 border rounded-lg shadow-2xl">
              <ChartViewer />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
