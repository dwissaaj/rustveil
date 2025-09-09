import { ResponsivePie } from "@nivo/pie";
import { ColorSchemeId } from "@nivo/colors";
import { FilterStateType, NivoPieType } from "../../../../../app/work/(workgroup)/social_network/centrality/state";

export function CentralityPieComponent({
  data,
  chartFilter,
}: {
  data: NivoPieType[];
  chartFilter: FilterStateType
}) {
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
      />
    </div>
  );
}
