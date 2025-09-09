import { ResponsivePie } from "@nivo/pie";
import { ColorSchemeId } from "@nivo/colors";
import { FilterStateType, NivoPieType } from "./state";

export function CentralityPie({
  data,
  chartFilter,
  height = "75vh",
}: {
  data: NivoPieType[];
  chartFilter: FilterStateType
  height?: string;
}) {
  return (
    <div className={`flex-1 h-[${height}]`}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={chartFilter.innerRadius}
        padAngle={chartFilter.padAngle}
        cornerRadius={chartFilter.cornerRadius}
        activeOuterRadiusOffset={8}
        arcLinkLabelsOffset={chartFilter.labelsOffset}
        arcLinkLabelsTextOffset={chartFilter.textOffset}
        colors={{ scheme: chartFilter.colorSchema as ColorSchemeId }}
      />
    </div>
  );
}
