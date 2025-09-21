import { ResponsivePie } from "@nivo/pie";
import { ColorSchemeId } from "@nivo/colors";

import { useTheme } from "next-themes";
import { NivoPieType, PieFilterStateType } from "@/app/work/(workgroup)/social_network/centrality/state";

export function CentralityPieComponent({
  data,
  chartFilter,
}: {
  data: NivoPieType[];
  chartFilter: PieFilterStateType;
}) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";

  return (
    <div className={`flex-1 h-[75vh]`}>
      <ResponsivePie
        data={data}
        margin={{
          top: chartFilter.topMargin,
          right: chartFilter.rightMargin,
          bottom: chartFilter.bottomMargin,
          left: chartFilter.leftMargin,
        }}
        startAngle={chartFilter.startAngle}
        endAngle={chartFilter.endAngle}
        innerRadius={chartFilter.innerRadius}
        padAngle={chartFilter.padAngle}
        cornerRadius={chartFilter.cornerRadius}
        activeOuterRadiusOffset={8}
        arcLinkLabelsOffset={chartFilter.labelsOffset}
        arcLinkLabelsTextOffset={chartFilter.textOffset}
        colors={{ scheme: chartFilter.colorSchema as ColorSchemeId }}
        arcLinkLabelsColor={{ from: "color" }} 
        enableArcLinkLabels={true}
        arcLinkLabelsThickness={2}
        arcLabelsSkipAngle={chartFilter.labelSkip}
        arcLinkLabelsDiagonalLength={chartFilter.labelDiagonalLength}
        arcLinkLabelsStraightLength={chartFilter.labelStraightLength}
        
        theme={{
          labels: {
            text: {
              fill: textColor,
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
