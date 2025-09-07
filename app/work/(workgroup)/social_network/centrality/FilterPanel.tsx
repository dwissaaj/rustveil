import { useAtom } from "jotai";
import { filterState, ColorSchema } from "./state";
import { Select, SelectItem,  Slider, Input } from "@heroui/react";
export function FilterPanel() {
  const [filter, setFilter] = useAtom(filterState);

  return (
    <div className="w-64 border-l pl-4">
      <h3 className="font-medium mb-2 flex flex-col gap-8">Filter Options</h3>

      <Slider
        label="Inner Radius"
        step={0.05}
        minValue={0}
        maxValue={0.95}
        value={filter.innerRadius}
        onChange={(val) =>
          setFilter({ ...filter, innerRadius: Number(val) })
        }
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
        maxValue={20}
        value={filter.cornerRadius}
        onChange={(val) => setFilter({ ...filter, cornerRadius: Number(val) })}
      />

      <Input
      className="my-4"
        label="Title"
        placeholder="Title graph"
        value={filter.title}
        onChange={(e) => setFilter({ ...filter, title: e.target.value })}
      />

      <Select
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
