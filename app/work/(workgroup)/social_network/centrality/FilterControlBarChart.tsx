import { useAtom } from "jotai";
import {
  BarFilterState,
  ColorSchema,
  topShowDataBar,
} from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import {
  Select,
  SelectItem,
  Slider,
  Input,
  Textarea,
  Divider,
  Switch,
} from "@heroui/react";
export function FilterPanelBarChart({ maxNodes }: { maxNodes: number }) {
  const [filter, setFilter] = useAtom(BarFilterState);
  const [topN, setTopN] = useAtom(topShowDataBar);

  const topOptions = [
    { label: "Top 10", value: 10 },
    { label: "Top 20", value: 20 },
    { label: "Top 30", value: 30 },
    { label: "Top 50", value: 50 },
    { label: "Top 100", value: 100 },
    {
      label: `Half (${Math.floor(maxNodes / 2)})`,
      value: Math.floor(maxNodes / 2),
    },
    {
      label: `3/4 (${Math.floor((maxNodes * 3) / 4)})`,
      value: Math.floor((maxNodes * 3) / 4),
    },
    { label: `All (${maxNodes})`, value: maxNodes },
  ];
  const selectPosition = [
    { label: "Top", value: "top" },
    { label: "Middle", value: "middle" },
    { label: "End", value: "end" },
  ];
  // topMargin: 50,
  // bottomMargin: 50,
  // leftMargin: 50,
  // rightMargin:50,
  // borderRadius: 0,
  // borderWidth: 0,
  // labelPosition: "start",
  // labelOffset: 0,
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-2xl font-bold my-2">Filter Options</h3>
      </div>
      <div>
        <Switch
          checked={filter.layout === "horizontal"}
          onValueChange={(checked: boolean) =>
            setFilter({
              ...filter,
              layout: checked ? "horizontal" : "vertical",
            })
          }
        >
          {filter.layout === "horizontal" ? "Horizontal" : "Vertical"}
        </Switch>
        <Select
          label="Label Position"
          value={filter.labelPosition}
          onChange={(e) =>
            setFilter({
              ...filter,
              labelPosition: e.target.value as "start" | "middle" | "end",
            })
          }
        >
          {selectPosition.map((opt) => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Slider
          size="sm"
          label="Label Offset"
          minValue={-16}
          maxValue={16}
          value={filter.labelOffset}
          onChange={(val) => setFilter({ ...filter, labelOffset: Number(val) })}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Select
          className=""
          label="Show Top"
          value={topN.toString()}
          onChange={(e) => setTopN(Number(e.target.value))}
        >
          {topOptions.map((opt) => (
            <SelectItem key={opt.value.toString()}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Select
          className=""
          label="Color Scheme"
          selectedKeys={[filter.colorSchema]}
          onChange={(e) =>
            setFilter({
              ...filter,
              colorSchema: e.target.value as ColorSchema,
            })
          }
        >
          {Object.values(ColorSchema).map((schema) => (
            <SelectItem key={schema}>{schema}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Input
          size="sm"
          className=""
          label="Top Margin"
          placeholder="Top"
          value={filter.topMargin.toString()}
          onChange={(e) =>
            setFilter({ ...filter, topMargin: Number(e.target.value) })
          }
        />
        <Input
          size="sm"
          className=""
          label="Bottom Margin"
          placeholder="Bottom"
          value={filter.bottomMargin.toString()}
          onChange={(e) =>
            setFilter({ ...filter, topMargin: Number(e.target.value) })
          }
        />
        <Input
          size="sm"
          className=""
          label="Left Margin"
          placeholder="Left"
          value={filter.leftMargin.toString()}
          onChange={(e) =>
            setFilter({ ...filter, leftMargin: Number(e.target.value) })
          }
        />
        <Input
          size="sm"
          className=""
          label="right Margin"
          placeholder="Right"
          value={filter.rightMargin.toString()}
          onChange={(e) =>
            setFilter({ ...filter, rightMargin: Number(e.target.value) })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-bold">Legend</h2>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            size="sm"
            className=""
            label="Bottom Legend"
            placeholder="Chart Title"
            value={filter.axisBottomLegend}
            onChange={(e) =>
              setFilter({ ...filter, axisBottomLegend: e.target.value })
            }
          />
          <Slider
            size="sm"
            label="Tick Size"
            minValue={0}
            maxValue={20}
            value={filter.axisBottomSize}
            onChange={(val) =>
              setFilter({ ...filter, axisBottomSize: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Padding"
            minValue={0}
            maxValue={20}
            value={filter.axisBottomPadding}
            onChange={(val) =>
              setFilter({ ...filter, axisBottomPadding: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Tick Rotation"
            minValue={-90}
            maxValue={90}
            value={filter.axisBottomRotation}
            onChange={(val) =>
              setFilter({ ...filter, axisBottomRotation: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Tick Offset"
            minValue={-60}
            maxValue={60}
            value={filter.axisBottomLegendOffset}
            onChange={(val) =>
              setFilter({ ...filter, axisBottomLegendOffset: Number(val) })
            }
          />
        </div>
        <Divider />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-bold">Left Legend</h2>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            size="sm"
            className=""
            label="Left Legend"
            placeholder="Data Title"
            value={filter.axisLeftLegend}
            onChange={(e) =>
              setFilter({ ...filter, axisLeftLegend: e.target.value })
            }
          />
          <Slider
            size="sm"
            label="Tick Size"
            minValue={0}
            maxValue={20}
            value={filter.axisLeftSize}
            onChange={(val) =>
              setFilter({ ...filter, axisLeftSize: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Padding"
            minValue={0}
            maxValue={20}
            value={filter.axisLeftPadding}
            onChange={(val) =>
              setFilter({ ...filter, axisLeftPadding: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Tick Rotation"
            minValue={-90}
            maxValue={90}
            value={filter.axisLeftRotation}
            onChange={(val) =>
              setFilter({ ...filter, axisLeftRotation: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Tick Offset"
            minValue={-60}
            maxValue={60}
            value={filter.axisLeftLegendOffset}
            onChange={(val) =>
              setFilter({ ...filter, axisLeftLegendOffset: Number(val) })
            }
          />
        </div>
      </div>
    </div>
  );
}
