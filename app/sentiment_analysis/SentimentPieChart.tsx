import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";
import { ColorSchemeId } from "@nivo/colors";

import { PieSentimentStateType } from "../lib/sentiment_analysis/state";
export interface SentimentDataType {
  id: string;
  value: number;
  label?: string;
}

export function SentimentPieChart({
  chartFilter,
  data,
}: {
  data: SentimentDataType[];
  chartFilter: PieSentimentStateType;
}) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";

  return (
    <div className={`flex-1 h-[75vh] `}>
      <ResponsivePie
        activeOuterRadiusOffset={8}
        arcLabelsSkipAngle={chartFilter.labelSkip}
        arcLinkLabelsColor={{ from: "color" }}
        arcLinkLabelsDiagonalLength={chartFilter.labelDiagonalLength}
        arcLinkLabelsOffset={chartFilter.labelsOffset}
        arcLinkLabelsStraightLength={chartFilter.labelStraightLength}
        arcLinkLabelsTextOffset={chartFilter.textOffset}
        arcLinkLabelsThickness={2}
        colors={{ scheme: chartFilter.colorSchema as ColorSchemeId }}
        cornerRadius={chartFilter.cornerRadius}
        data={data}
        enableArcLinkLabels={true}
        endAngle={chartFilter.endAngle}
        innerRadius={chartFilter.innerRadius}
        margin={{
          top: chartFilter.topMargin,
          right: chartFilter.rightMargin,
          bottom: chartFilter.bottomMargin,
          left: chartFilter.leftMargin,
        }}
        padAngle={chartFilter.padAngle}
        startAngle={chartFilter.startAngle}
        theme={{
          labels: {
            text: {
              fill: textColor,
              fontSize: 16,
              fontWeight: 600,
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
      />
    </div>
  );
}
