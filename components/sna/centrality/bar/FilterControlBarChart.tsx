import { useAtom } from "jotai";
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
import {
  BarFilterState,
  topShowDataBar,
  ColorSchema,
} from "@/app/social_network/centrality/state";

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
              className=""
              label="Chart Title"
              placeholder="Title"
              size="sm"
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
              className=""
              label="Author"
              placeholder="Your Name"
              size="sm"
              value={filter.author}
              onChange={(e) => setFilter({ ...filter, author: e.target.value })}
            />
          </div>
        </AccordionItem>
        <AccordionItem key="3" aria-label="Label Setting" title="Label">
          <div className="flex flex-col gap-2">
            <Select
              label="Label Position"
              size="sm"
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
              label="Label Offset"
              maxValue={16}
              minValue={-16}
              size="sm"
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
              className=""
              label="Top Margin"
              placeholder="Top"
              size="sm"
              value={filter.topMargin.toString()}
              onChange={(e) =>
                setFilter({ ...filter, topMargin: Number(e.target.value) })
              }
            />
            <Input
              className=""
              label="Bottom Margin"
              placeholder="Bottom"
              size="sm"
              value={filter.bottomMargin.toString()}
              onChange={(e) =>
                setFilter({ ...filter, topMargin: Number(e.target.value) })
              }
            />
            <Input
              className=""
              label="Left Margin"
              placeholder="Left"
              size="sm"
              value={filter.leftMargin.toString()}
              onChange={(e) =>
                setFilter({ ...filter, leftMargin: Number(e.target.value) })
              }
            />
            <Input
              className=""
              label="right Margin"
              placeholder="Right"
              size="sm"
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
                className=""
                label="Title Bottom"
                placeholder="Chart Title"
                size="sm"
                value={filter.axisBottomLegend}
                onChange={(e) =>
                  setFilter({ ...filter, axisBottomLegend: e.target.value })
                }
              />
              <Slider
                label="Tick Size"
                maxValue={20}
                minValue={0}
                size="sm"
                value={filter.axisBottomSize}
                onChange={(val) =>
                  setFilter({ ...filter, axisBottomSize: Number(val) })
                }
              />
              <Slider
                label="Padding"
                maxValue={20}
                minValue={0}
                size="sm"
                value={filter.axisBottomPadding}
                onChange={(val) =>
                  setFilter({ ...filter, axisBottomPadding: Number(val) })
                }
              />
              <Slider
                label="Tick Rotation"
                maxValue={90}
                minValue={-90}
                size="sm"
                value={filter.axisBottomRotation}
                onChange={(val) =>
                  setFilter({ ...filter, axisBottomRotation: Number(val) })
                }
              />
              <Slider
                label="Tick Offset"
                maxValue={60}
                minValue={-60}
                size="sm"
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
                className=""
                label="Left Legend"
                placeholder="Data Title"
                size="sm"
                value={filter.axisLeftLegend}
                onChange={(e) =>
                  setFilter({ ...filter, axisLeftLegend: e.target.value })
                }
              />
              <Slider
                label="Tick Size"
                maxValue={20}
                minValue={0}
                size="sm"
                value={filter.axisLeftSize}
                onChange={(val) =>
                  setFilter({ ...filter, axisLeftSize: Number(val) })
                }
              />
              <Slider
                label="Padding"
                maxValue={20}
                minValue={0}
                size="sm"
                value={filter.axisLeftPadding}
                onChange={(val) =>
                  setFilter({ ...filter, axisLeftPadding: Number(val) })
                }
              />
              <Slider
                label="Tick Rotation"
                maxValue={90}
                minValue={-90}
                size="sm"
                value={filter.axisLeftRotation}
                onChange={(val) =>
                  setFilter({ ...filter, axisLeftRotation: Number(val) })
                }
              />
              <Slider
                label="Tick Offset"
                maxValue={50}
                minValue={-200}
                size="sm"
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
            className="w-full"
            color="primary"
            startContent={<DownloadActionIconSolid className="w-6" />}
            variant="solid"
            onPress={exportImage}
          >
            Download Image
          </Button>
        </AccordionItem>
      </Accordion>
    </>
  );
}
