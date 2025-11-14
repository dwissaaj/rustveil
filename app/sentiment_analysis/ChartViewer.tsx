import React, { useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Tooltip,
  addToast,
} from "@heroui/react";
import { useTheme } from "next-themes";

import { useExportToImage } from "../lib/workstation/social/useExportToImage";
import {
  PieSentimentFilterState,
  sentimentCountData,
  showFilterSentiment,
} from "../lib/sentiment_analysis/state";
import { FilterPanelSentiment } from "../../components/sentiment_analysis/FilterPanelSentiment";
import NoSentimentData from "../../components/sentiment_analysis/NoSentimentData";

import { SentimentPieChart } from "./SentimentPieChart";

import { FilterIcon, InfoIcon } from "@/components/icon/IconFilter";
import { FullScreenIcon } from "@/components/icon/IconView";
export default function ChartViewer() {
  const totalCountData = useAtomValue(sentimentCountData);
  const chartFilter = useAtomValue(PieSentimentFilterState);
  const [showFilter, setshowFilter] = useAtom(showFilterSentiment);
  const { theme } = useTheme();
  const senData = [
    {
      id: "Positive",
      label: "Positive",
      value: totalCountData.total_positive_data,
    },
    {
      id: "Negative",
      label: "Negative",
      value: totalCountData.total_negative_data,
    },
  ];
  const chartRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const exportImage = useExportToImage({
    targetRef: chartRef,
    filename: `${chartFilter.title}`,
  });
  const handletoImage = async () => {
    try {
      const response = await exportImage();

      if (response?.response_code === 200) {
        addToast({
          title: "Image Exported",
          description: `${response?.message}`,
          color: "success",
        });
        onOpenChange();
      }

      if (response?.response_code !== 200) {
        addToast({
          title: "Operation Error",
          description: `${response?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Operation Error",
        description: `${error}`,
        color: "danger",
      });
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col items-start justify-center gap-10 rounded-xl p-4">
      <div className="font-medium flex flex-row justify-start gap-4 items-center">
        <Button
          isIconOnly
          color="primary"
          startContent={<FullScreenIcon className="w-6" />}
          variant="flat"
          onPress={onOpen}
        />
        <Tooltip content="Customize Chart in Full Screen Mode">
          <Button
            isIconOnly
            color="primary"
            startContent={<InfoIcon className="w-6" />}
            variant="flat"
          />
        </Tooltip>
      </div>

      <div className="w-full h-full ">
        {!senData ||
        senData.length === 0 ||
        senData.every((d) => d.value === 0) ? (
          <div className="flex items-center min-h-full w-full">
            <NoSentimentData />
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <div className="min-w-[1200px] h-[75vh]">
              <SentimentPieChart
                chartFilter={{
                  ...chartFilter,
                  topMargin: 50,
                  rightMargin: 50,
                  bottomMargin: 50,
                  leftMargin: 50,
                }}
                data={senData}
              />
            </div>
          </div>
        )}
      </div>

      <Modal
        className="w-4/5 max-w-[1800px]"
        isOpen={isOpen}
        scrollBehavior="outside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-row justify-start gap-4 items-center">
            <Button
              isIconOnly
              color="default"
              startContent={<FilterIcon className="w-4" />}
              variant="light"
              onPress={() => setshowFilter(!showFilter)}
            />
          </ModalHeader>

          <ModalBody>
            <div className="flex gap-2">
              <div className={showFilter ? "w-3/4" : "w-full"}>
                <div
                  ref={chartRef}
                  style={{
                    background: theme === "dark" ? "#18181b" : "#ffffff",
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <p className="text-lg font-bold">{chartFilter.title}</p>
                    <p className="text-sm font-light">
                      {chartFilter.description}
                    </p>
                    <p className="text-sm font-light italic">
                      {chartFilter.author}
                    </p>
                  </div>
                  {!senData ||
                  senData.length === 0 ||
                  senData.every((d) => d.value === 0) ? (
                    <div className="flex items-center min-h-full w-full">
                      <NoSentimentData />
                    </div>
                  ) : (
                    <SentimentPieChart
                      chartFilter={chartFilter}
                      data={senData}
                    />
                  )}
                </div>
              </div>

              {showFilter && (
                <div className="w-1/4 " style={{ maxHeight: "75vh" }}>
                  <FilterPanelSentiment exportImage={handletoImage} />
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
