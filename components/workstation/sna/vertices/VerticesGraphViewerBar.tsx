import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { primitiveColor } from "@/components/color-primitive";
import { useTheme } from "next-themes";
import { NivoBarDatum } from "@/app/lib/NivoFormatTable";

export interface NivoBarChartProps {
  data: NivoBarDatum[];
}
export const VerticesGraphViewerBar = ({ data }: NivoBarChartProps) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const axisColor = theme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
   const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff"; 
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937"; 
  return (
    <ResponsiveBar
      data={data}
      axisBottom={{
        legend: "Username",
        legendOffset: 75,
        tickRotation: -30,
        tickSize: 5,
        tickPadding: 5,
        
      }}
      
      axisLeft={{ legend: "Centrality Value", legendOffset: -40 ,}}
      keys={["centrality"]}
      indexBy="username"
      margin={{
        top: 20,
        right: 20,
        bottom: 80,
        left: 60,
      }}
      padding={0}
      theme={{
        axis: {
          domain: { 
            line: {
              stroke: axisColor, 
            },
          },
          ticks: { 
            line: {
              stroke: axisColor, 
            },
            text: {
              fill: textColor,
            },
          },
          legend: { 
            text: {
              fill: textColor,
            },
          },
        },
        grid: { 
          line: {
            stroke: gridColor, 
            strokeWidth: 1,
          },
        },
        tooltip : {
          container: {
            background: tooltipBackgroundColor, 
            color: tooltipTextColor,          
            fontSize: 12, 
            borderRadius: 4, 
          },
        }
      }}
      colors={primitiveColor}
    />
  );
};
