import { useAtom } from "jotai";

import {
  Slider,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  Button,
} from "@heroui/react";
import { DownloadActionIconSolid } from "@/components/icon/IconAction";
import { PieSentimentFilterState } from "../../app/lib/sentiment_analysis/state";
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
              size="sm"
              label="Start Angle"
              minValue={-180}
              maxValue={360}
              value={filter.startAngle}
              onChange={(val) =>
                setFilter({ ...filter, startAngle: Number(val) })
              }
            />

            <Slider
              size="sm"
              label="End Angle"
              minValue={-360}
              maxValue={360}
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
          <Slider
            size="sm"
            label="Label Skip"
            minValue={0}
            maxValue={45}
            value={filter.labelSkip}
            onChange={(val) => setFilter({ ...filter, labelSkip: Number(val) })}
          />
          <Slider
            size="sm"
            label="Label Straight Length"
            minValue={0}
            maxValue={36}
            value={filter.labelStraightLength}
            onChange={(val) =>
              setFilter({ ...filter, labelStraightLength: Number(val) })
            }
          />
          <Slider
            size="sm"
            label="Label Diagonal Length"
            minValue={0}
            maxValue={36}
            value={filter.labelDiagonalLength}
            onChange={(val) =>
              setFilter({ ...filter, labelDiagonalLength: Number(val) })
            }
          />
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
                setFilter({ ...filter, bottomMargin: Number(e.target.value) })
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
        <AccordionItem key="5" aria-label="Export" title="Export">
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
