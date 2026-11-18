import { useAtom } from "jotai";
import {
  Slider,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  Button,
} from "@heroui/react";

import { PieSentimentFilterState } from "../../app/lib/sentiment_analysis/state";

import { DownloadActionIconSolid } from "@/components/icon/IconAction";
interface FilterType {
  exportImage: () => void;
}
export function FilterPanelSentiment({ exportImage }: FilterType) {
  const [filter, setFilter] = useAtom(PieSentimentFilterState);

  return (
    <>
      <div>
        <h3 className="text-2xl font-bold my-2">Filter Options</h3>
      </div>
      <Accordion>
        <AccordionItem key="1" aria-label="General Tab" title="General">
          <div className="flex flex-col gap-2">
            <Slider
              label="Start Angle"
              maxValue={360}
              minValue={-180}
              size="sm"
              value={filter.startAngle}
              onChange={(val) =>
                setFilter({ ...filter, startAngle: Number(val) })
              }
            />

            <Slider
              label="End Angle"
              maxValue={360}
              minValue={-360}
              size="sm"
              value={filter.endAngle}
              onChange={(val) =>
                setFilter({ ...filter, endAngle: Number(val) })
              }
            />
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
        <AccordionItem key="3" aria-label="Label" title="Label">
          <Slider
            label="Inner Radius"
            maxValue={0.95}
            minValue={0}
            size="sm"
            step={0.05}
            value={filter.innerRadius}
            onChange={(val) =>
              setFilter({ ...filter, innerRadius: Number(val) })
            }
          />

          <Slider
            label="Pad Angle"
            maxValue={10}
            minValue={0}
            size="sm"
            step={0.1}
            value={filter.padAngle}
            onChange={(val) => setFilter({ ...filter, padAngle: Number(val) })}
          />

          <Slider
            label="Corner Radius"
            maxValue={45}
            minValue={0}
            size="sm"
            step={1}
            value={filter.cornerRadius}
            onChange={(val) =>
              setFilter({ ...filter, cornerRadius: Number(val) })
            }
          />
          <Slider
            defaultValue={0}
            label="Label Offset"
            maxValue={24}
            minValue={-24}
            size="sm"
            step={1}
            value={filter.labelsOffset}
            onChange={(val) =>
              setFilter({ ...filter, labelsOffset: Number(val) })
            }
          />
          <Slider
            defaultValue={0}
            label="Text Offset"
            maxValue={24}
            minValue={-24}
            size="sm"
            step={1}
            value={filter.textOffset}
            onChange={(val) =>
              setFilter({ ...filter, textOffset: Number(val) })
            }
          />
          <Slider
            label="Label Skip"
            maxValue={45}
            minValue={0}
            size="sm"
            value={filter.labelSkip}
            onChange={(val) => setFilter({ ...filter, labelSkip: Number(val) })}
          />
          <Slider
            label="Label Straight Length"
            maxValue={36}
            minValue={0}
            size="sm"
            value={filter.labelStraightLength}
            onChange={(val) =>
              setFilter({ ...filter, labelStraightLength: Number(val) })
            }
          />
          <Slider
            label="Label Diagonal Length"
            maxValue={36}
            minValue={0}
            size="sm"
            value={filter.labelDiagonalLength}
            onChange={(val) =>
              setFilter({ ...filter, labelDiagonalLength: Number(val) })
            }
          />
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
                setFilter({ ...filter, bottomMargin: Number(e.target.value) })
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
        <AccordionItem key="5" aria-label="Export" title="Export">
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
