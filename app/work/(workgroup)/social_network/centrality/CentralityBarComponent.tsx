import { ColorSchemeId } from "@nivo/colors";
import {
  BarFilterStateType,
  NivoBarType
} from "./state";
import { ResponsiveBar } from "@nivo/bar";

export function CentralityBarComponent({
  data,
  chartFilter,
}: {
  data: NivoBarType[];
  chartFilter: BarFilterStateType;
}) {
  return (
    <div className={`flex-1 h-[75vh]`}>
      <ResponsiveBar
        labelPosition={chartFilter.labelPosition}
        labelOffset={chartFilter.labelOffset}
        layout={chartFilter.layout}
        data={data}
        keys={["centrality"]}
        indexBy="node"
        margin={{ top: chartFilter.topMargin, 
          right: chartFilter.rightMargin,
           bottom: chartFilter.bottomMargin, 
          left: chartFilter.leftMargin }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: chartFilter.colorSchema as ColorSchemeId }}
        axisBottom={{
          tickRotation: chartFilter.axisBottomRotation,
          tickSize:  chartFilter.axisBottomSize,
          tickPadding:  chartFilter.axisBottomPadding,
          legend:  chartFilter.axisBottomLegend,
          legendPosition: "middle",
          legendOffset: chartFilter.axisBottomLegendOffset,
        }}
        axisLeft={{
          tickRotation: chartFilter.axisLeftRotation,
          tickSize:  chartFilter.axisLeftRotation,
          tickPadding:  chartFilter.axisLeftPadding,
          legend:  chartFilter.axisLeftLegend,
          legendPosition: "middle",
          legendOffset: chartFilter.axisLeftLegendOffset,
        }}
        enableGridY={true}
      />
    </div>
  );
}
