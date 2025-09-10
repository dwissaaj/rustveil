import { ColorSchemeId } from "@nivo/colors";
import {
  BarFilterStateType,
  NivoBarType,
} from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "next-themes";

export function CentralityBarComponent({
  data,
  chartFilter,
}: {
  data: NivoBarType[];
  chartFilter: BarFilterStateType;
}) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const axisColor = theme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  return (
    <div className={`flex-1 h-[75vh]`}>
      <ResponsiveBar
        labelPosition={chartFilter.labelPosition}
        labelOffset={chartFilter.labelOffset}
        layout={chartFilter.layout}
        data={data}
        keys={["centrality"]}
        indexBy="node"
        margin={{
          top: chartFilter.topMargin,
          right: chartFilter.rightMargin,
          bottom: chartFilter.bottomMargin,
          left: chartFilter.leftMargin,
        }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: chartFilter.colorSchema as ColorSchemeId }}
        axisBottom={{
          tickRotation: chartFilter.axisBottomRotation,
          tickSize: chartFilter.axisBottomSize,
          tickPadding: chartFilter.axisBottomPadding,
          legend: chartFilter.axisBottomLegend,
          legendPosition: "middle",
          legendOffset: chartFilter.axisBottomLegendOffset,
        }}
        axisLeft={{
          tickRotation: chartFilter.axisLeftRotation,
          tickSize: chartFilter.axisLeftSize,
          tickPadding: chartFilter.axisLeftPadding,
          legend: chartFilter.axisLeftLegend,
          legendPosition: "middle",
          legendOffset: chartFilter.axisLeftLegendOffset,
        }}
        enableGridY={true}
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
          tooltip: {
            container: {
              background: tooltipBackgroundColor,
              color: tooltipTextColor,
              fontSize: 12,
              borderRadius: 4,
            },
          },
        }}
      />
    </div>
  );
}
