import { useAtom } from "jotai";
import {
  PieFilterState,
  ColorSchema,
  topShowDataPie,
} from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import {
  Select,
  SelectItem,
  Slider,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
} from "@heroui/react";

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
    <>
      <div>
        <h3 className="text-2xl font-bold my-2">Filter Options</h3>
      </div>
      <Accordion>
        <AccordionItem key="1" aria-label="General Tab" title="General">
<div className="flex flex-col gap-2">
             <Select
            className=""
            label="Show Top Nodes"
            value={topN.toString()}
            onChange={(e) => setTopN(Number(e.target.value))}
          >
            {topOptions.map((opt) => (
              <SelectItem key={opt.value.toString()}>{opt.label}</SelectItem>
            ))}
          </Select>
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
          
        </AccordionItem>
        <AccordionItem key="2" aria-label="title tab" title="Title">
          <div className="flex flex-col gap-2">
            <Input
            className=""
            label="Title"
            placeholder={filter.title}
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
          />
          <Input
            className=""
            label="Author"
            placeholder="Author Reference"
            value={filter.author}
            onChange={(e) => setFilter({ ...filter, author: e.target.value })}
          />
          <Textarea
            className=""
            label="Description"
            placeholder="Description about the chart"
            value={filter.description}
            onChange={(e) =>
              setFilter({ ...filter, description: e.target.value })
            }
          />
          </div>

         
         
          
        </AccordionItem>
        <AccordionItem key="3" aria-label="Legend" title="Legend">
           <Slider
           size="sm"
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
          size="sm"
            label="Pad Angle"
            step={0.1}
            minValue={0}
            maxValue={10}
            value={filter.padAngle}
            onChange={(val) => setFilter({ ...filter, padAngle: Number(val) })}
          />

          <Slider
          size="sm"
            label="Corner Radius"
            step={1}
            minValue={0}
            maxValue={45}
            value={filter.cornerRadius}
            onChange={(val) =>
              setFilter({ ...filter, cornerRadius: Number(val) })
            }
          />
          <Slider
          size="sm"
            label="Label Offset"
            step={1}
            minValue={-24}
            maxValue={24}
            defaultValue={0}
            value={filter.labelsOffset}
            onChange={(val) =>
              setFilter({ ...filter, labelsOffset: Number(val) })
            }
          />
          <Slider
          size="sm"
            label="Text Offset"
            step={1}
            defaultValue={0}
            minValue={-24}
            maxValue={24}
            value={filter.textOffset}
            onChange={(val) =>
              setFilter({ ...filter, textOffset: Number(val) })
            }
          />

        </AccordionItem>
        <AccordionItem key="5" aria-label="Margin Setting" title="Margin">
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
        </AccordionItem>

      </Accordion>
    </>
  );
}
