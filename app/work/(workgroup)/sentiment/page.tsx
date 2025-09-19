"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "@heroui/button";
import ColumnViewer from "./ColumnViewer";
import ChartViewer from "./ChartViewer";
import Filter from "../../../../components/workstation/sentiment_analysis/SentimentAnalysisFilterWrapper";
import { useSentimentAnalysis } from "./useSentimentAnalysis";

export default function NetworkHome() {
  const { theme } = useTheme();
  const calculate = useSentimentAnalysis()
  const handlePress = async ()=> {
    try {
      const res = await calculate()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2">
      <div>
        <Button onPress={handlePress}>
          click
        </Button>
        <Filter />
      </div>
      <div>
        <PanelGroup
      className="flex gap-2 w-full max-w-screen max-h-full items-stretch"
      autoSaveId="panel sna"
      direction="horizontal"
    >
      <Panel defaultSize={50}>
        <div className="max-h-[85vh]">
          <ColumnViewer />
        </div>
      </Panel>
      <PanelResizeHandle
        className={`w-2 m-2 ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} rounded transition-colors duration-200 hover:opacity-100 opacity-40 transition-200`}
      />
      <Panel defaultSize={50}>
        <ChartViewer />
      </Panel>
    </PanelGroup>
      </div>
    </div>
  );
}
