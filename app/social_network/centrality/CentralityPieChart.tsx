"use client";

import { CalculateCentralityType } from "@/app/lib/workstation/social/calculate/state";
import { FilterIcon, InfoIcon } from "@/components/icon/IconFilter";
import { FullScreenIcon } from "@/components/icon/IconView";
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
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useRef, useState } from "react";
import { PieFilterState, showFilterAtom, topShowDataPie } from "./state";
import {
  selectedCentrality,
  selectedChart,
} from "@/app/lib/workstation/social/centrality/state";

import { useTheme } from "next-themes";
import NoDataChartComponent from "@/components/sna/centrality/NoDataChartComponent";
import AllZeroComponent from "@/components/sna/centrality/AllZeroComponent";
import { useExportToImage } from "@/app/lib/workstation/social/useExportToImage";
import { CentralityPieComponent } from "@/components/sna/centrality/pie/CentralityPieComponent";
import { FilterPanelPieChart } from "@/components/sna/centrality/pie/FilterPanelPieChart";

export function CentralityPieChart({
  graphData,
  centralityKey,
}: {
  graphData: CalculateCentralityType | null | undefined;
  centralityKey: keyof Omit<CalculateCentralityType, "node_map">;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const chartFilter = useAtomValue(PieFilterState);
  const [showFilter, setshowFilter] = useAtom(showFilterAtom);
  const chart = useAtomValue(selectedChart);
  const centrality = useAtomValue(selectedCentrality);
  const nodes = graphData?.node_map ?? {};
  const values = graphData?.[centralityKey] ?? [];
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
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
  const topN = useAtomValue(topShowDataPie);
  const data = useMemo(() => {
    const mapped = values
      .map((value, index) => ({
        id: nodes[index] ?? `Node ${index}`,
        label: nodes[index] ?? `Node ${index}`,
        value: Number(value.toPrecision(3)),
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);

    const safeTopN = Math.min(topN ?? mapped.length, mapped.length);
    return mapped.slice(0, safeTopN);
  }, [values, nodes, topN]);

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="w-full flex flex-col gap-10 border rounded-xl p-4">
      <div className="font-medium flex flex-row justify-start gap-4 items-center">
        <Button
          variant="flat"
          isIconOnly
          startContent={<FullScreenIcon className="w-6" />}
          color="primary"
          onPress={onOpen}
        ></Button>
        <Tooltip content="Customize Chart in Full Screen Mode">
          <Button
            variant="flat"
            isIconOnly
            startContent={<InfoIcon className="w-6" />}
            color="primary"
          ></Button>
        </Tooltip>
      </div>

      <div className="flex-1 w-full">
        {graphData === null || graphData === undefined ? (
          <NoDataChartComponent />
        ) : hasData ? (
          <div className="flex-1 w-full ">
            <div className="min-w-[1200px] h-[75vh]">
              <CentralityPieComponent
                data={data}
                chartFilter={{
                  ...chartFilter,
                  topMargin: 50,
                  rightMargin: 50,
                  bottomMargin: 50,
                  leftMargin: 50,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="">
            <AllZeroComponent />
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="w-4/5 max-w-[1800px]"
        scrollBehavior="outside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-row justify-start gap-4 items-center">
            {chart.toUpperCase()} - {centrality.toUpperCase()}
            <Button
              variant="light"
              color="default"
              isIconOnly
              startContent={<FilterIcon className="w-4" />}
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
                  <CentralityPieComponent
                    data={data}
                    chartFilter={chartFilter}
                  />
                </div>
              </div>

              {showFilter && (
                <div className="w-1/4 " style={{ maxHeight: "75vh" }}>
                  <FilterPanelPieChart
                    exportImage={handletoImage}
                    maxNodes={Object.keys(graphData?.node_map ?? {}).length}
                  />
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
