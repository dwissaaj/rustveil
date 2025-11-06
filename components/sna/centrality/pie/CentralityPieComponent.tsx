import { ResponsivePie } from "@nivo/pie";
import { ColorSchemeId } from "@nivo/colors";
<<<<<<< HEAD:components/sna/centrality/pie/CentralityPieComponent.tsx

import { useTheme } from "next-themes";
import {
  NivoPieType,
  PieFilterStateType,
} from "@/app/social_network/centrality/state";
=======
import {
  PieFilterStateType,
  NivoPieType,
} from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import { useTheme } from "next-themes";
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/centrality/pie/CentralityPieComponent.tsx

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
<<<<<<< HEAD:components/sna/centrality/pie/CentralityPieComponent.tsx
        arcLinkLabelsColor={{ from: "color" }}
=======
        arcLinkLabelsColor={{ from: "color" }} 
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/centrality/pie/CentralityPieComponent.tsx
        enableArcLinkLabels={true}
        arcLinkLabelsThickness={2}
        arcLabelsSkipAngle={chartFilter.labelSkip}
        arcLinkLabelsDiagonalLength={chartFilter.labelDiagonalLength}
        arcLinkLabelsStraightLength={chartFilter.labelStraightLength}
<<<<<<< HEAD:components/sna/centrality/pie/CentralityPieComponent.tsx
=======
        
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/centrality/pie/CentralityPieComponent.tsx
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
<<<<<<< HEAD:components/sna/centrality/pie/CentralityPieComponent.tsx
=======
        
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/centrality/pie/CentralityPieComponent.tsx
      />
    </div>
  );
}
