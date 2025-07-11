import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from 'next-themes'; // Assuming you still need theme for text colors etc.
import { primitiveColor } from "@/components/color-primitive"; // Assuming you want to use the same color scheme

// This would be your NivoBarDatum or a similar type for pie chart
export interface NivoPieDatum {
  id: number;
  username: string;
  centrality: number;
}

export interface NivoPieChartProps {
  data: NivoPieDatum[];
}

export const VerticesGraphViewerPie = ({ data }: NivoPieChartProps) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";

  return (
    <ResponsivePie
      data={data}
      id="username"    
      value="centrality" 
      margin={{ top: 80, right: 120, bottom: 80, left: 120 }}
      innerRadius={0.3} 
      padAngle={2}
      cornerRadius={10}
      activeOuterRadiusOffset={8}
      colors={primitiveColor} // Use your defined color scheme
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            0.2
          ]
        ]
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={textColor} 
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      
      
      
      theme={{
        labels: {
          text: {
            fill: textColor, // Color for the labels displayed on the arcs
          },
        },
        legends: {
          text: {
            fill: textColor,
          },
        },
        tooltip: {
          container: {
            background: tooltipBackgroundColor,
            color: tooltipTextColor,
            fontSize: 12,
            borderRadius: 4,
          },
        },
      }}
      
      // Optional: Add a legend if desired (separate from axis legends)
      legends={[
        {
          anchor: 'top-left',
          direction: 'column',
          justify: false,
          translateX: -100,
          translateY: -30,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: textColor, // Set legend item text color
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: textColor // Also for hover state
              }
            }
          ]
        }
      ]}
    />
  );
};