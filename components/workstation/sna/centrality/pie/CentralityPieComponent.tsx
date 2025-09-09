import { ResponsivePie } from "@nivo/pie";
import { ColorSchemeId } from "@nivo/colors";
import { PieFilterStateType, NivoPieType } from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import { useTheme } from "next-themes";

export function CentralityPieComponent({
  data,
  chartFilter,
}: {
  data: NivoPieType[];
  chartFilter: PieFilterStateType
}) {
    const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";

  return (
    <div className={`flex-1 h-[75vh]`}>
      <ResponsivePie
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={chartFilter.innerRadius}
          padAngle={chartFilter.padAngle}
          cornerRadius={chartFilter.cornerRadius}
          activeOuterRadiusOffset={8}
          arcLinkLabelsOffset={chartFilter.labelsOffset}
        colors={{ scheme: chartFilter.colorSchema as ColorSchemeId }}
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
      />
    </div>
  );
}
