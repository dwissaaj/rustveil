import { useAtom } from "jotai";
import { PieFilterState, ColorSchema, topShowDataPie } from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import { Select, SelectItem, Slider, Input, Textarea } from "@heroui/react";
export function FilterPanelPieChart({ maxNodes }: { maxNodes: number }) {
  const [filter, setFilter] = useAtom(PieFilterState);
  const [topN, setTopN] = useAtom(topShowDataPie);

  const topOptions = [
    { label: "Top 10", value: 10 },
    { label: "Top 20", value: 20 },
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

  return (
    <div className="w-64 ">
      <h3 className="font-xl font-bold flex flex-col gap-8">Filter Options</h3>
      <Input
        className="my-4"
        label="Title"
        placeholder={filter.title}
        value={filter.title}
        onChange={(e) => setFilter({ ...filter, title: e.target.value })}
      />
      <Input
        className="my-4"
        label="Author"
        placeholder="Author Reference"
        value={filter.author}
        onChange={(e) => setFilter({ ...filter, author: e.target.value })}
      />
      <Textarea
        className="my-4"
        label="Description"
        placeholder="Description about the chart"
        value={filter.description}
        onChange={(e) => setFilter({ ...filter, description: e.target.value })}
      />
      <Select
        className="my-2 max-w-xs"
        label="Show Top Nodes"
        value={topN.toString()}
        onChange={(e) => setTopN(Number(e.target.value))}
      >
        {topOptions.map((opt) => (
          <SelectItem key={opt.value.toString()}>{opt.label}</SelectItem>
        ))}
      </Select>
      <Slider
        label="Inner Radius"
        step={0.05}
        minValue={0}
        maxValue={0.95}
        value={filter.innerRadius}
        onChange={(val) => setFilter({ ...filter, innerRadius: Number(val) })}
      />

      <Slider
        label="Pad Angle"
        step={0.1}
        minValue={0}
        maxValue={10}
        value={filter.padAngle}
        onChange={(val) => setFilter({ ...filter, padAngle: Number(val) })}
      />

      <Slider
        label="Corner Radius"
        step={1}
        minValue={0}
        maxValue={45}
        value={filter.cornerRadius}
        onChange={(val) => setFilter({ ...filter, cornerRadius: Number(val) })}
      />
      <Slider
        label="Label Offset"
        step={1}
        minValue={-24}
        maxValue={24}
        defaultValue={0}
        value={filter.labelsOffset}
        onChange={(val) => setFilter({ ...filter, labelsOffset: Number(val) })}
      />
      <Slider
        label="Text Offset"
        step={1}
        defaultValue={0}
        minValue={-24}
        maxValue={24}
        value={filter.textOffset}
        onChange={(val) => setFilter({ ...filter, textOffset: Number(val) })}
      />

      <Select
        className="my-4"
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
  );
}
