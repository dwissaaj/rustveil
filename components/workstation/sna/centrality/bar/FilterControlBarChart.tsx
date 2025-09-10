import { useAtom } from "jotai";
import {
  BarFilterState,
  topShowDataBar,
  ColorSchema,
} from "../../../../../app/work/(workgroup)/social_network/centrality/state";
import {
  Select,
  SelectItem,
  Slider,
  Input,
  Textarea,
  Switch,
  Accordion,
  AccordionItem,
  Button,
} from "@heroui/react";
import { DownloadActionIconSolid } from "@/components/icon/IconAction";

interface FilterType {
  maxNodes: number;
  exportImage: () => void;
}

export function FilterPanelBarChart({ maxNodes, exportImage }: FilterType) {
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

  return (
    <>
      <div>
        <h3 className="text-2xl font-bold my-2">Filter Options </h3>
      </div>
      <Accordion>
        <AccordionItem key="1" aria-label="Accordion 1" title="General">
          <div className="flex flex-col gap-2">
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
        <AccordionItem key="2" aria-label="Accordion 1" title="Title">
          <div className="flex flex-col gap-2">
            <Input
              size="sm"
              className=""
              label="Chart Title"
              placeholder="Title"
              value={filter.title}
              onChange={(e) => setFilter({ ...filter, title: e.target.value })}
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
            <Input
              size="sm"
              className=""
              label="Author"
              placeholder="Your Name"
              value={filter.author}
              onChange={(e) => setFilter({ ...filter, author: e.target.value })}
            />
          </div>
        </AccordionItem>
        <AccordionItem key="3" aria-label="Label Setting" title="Label">
          <div className="flex flex-col gap-2">
            <Select
              size="sm"
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
              onChange={(val) =>
                setFilter({ ...filter, labelOffset: Number(val) })
              }
            />
          </div>
        </AccordionItem>
        <AccordionItem key="4" aria-label="Margin Setting" title="Margin">
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
        <AccordionItem
          key="5"
          aria-label="Bottom Legend Setting"
          title="Bottom Legend"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Input
                size="sm"
                className=""
                label="Title Bottom"
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
                  setFilter({
                    ...filter,
                    axisBottomLegendOffset: Number(val),
                  })
                }
              />
            </div>
          </div>
        </AccordionItem>
        <AccordionItem
          key="6"
          aria-label="Left Legend Setting"
          title="Left Legend"
        >
          <div className="flex flex-col gap-2">
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
                minValue={-200}
                maxValue={50}
                value={filter.axisLeftLegendOffset}
                onChange={(val) =>
                  setFilter({
                    ...filter,
                    axisLeftLegendOffset: Number(val),
                  })
                }
              />
            </div>
          </div>
        </AccordionItem>
        <AccordionItem key="7" aria-label="Export" title="Export">
          <Button
            startContent={<DownloadActionIconSolid className="w-6" />}
            className="w-full"
            onPress={exportImage}
            variant="solid"
            color="primary"
          >
            Download Image
          </Button>
        </AccordionItem>
      </Accordion>
    </>
  );
}
