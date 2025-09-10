"use client";
import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
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
import { BarFilterState, showFilterAtom, topShowDataBar } from "./state";
import {
  selectedCentrality,
  selectedChart,
} from "@/app/lib/workstation/social/centrality/state";
import { FilterPanelBarChart } from "../../../../../components/workstation/sna/centrality/bar/FilterControlBarChart";
import { CentralityBarComponent } from "../../../../../components/workstation/sna/centrality/bar/CentralityBarComponent";
import { useExportToImage } from "./useExport";

export function CentralityBarChart({
  graphData,
  centralityKey,
}: {
  graphData: CalculateCentralityType | null | undefined;
  centralityKey: keyof Omit<CalculateCentralityType, "node_map">;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const chartFilter = useAtomValue(BarFilterState);
  const [showFilter, setshowFilter] = useAtom(showFilterAtom);
  const chart = useAtomValue(selectedChart);
  const centrality = useAtomValue(selectedCentrality);
  const nodes = graphData?.node_map ?? {};
  const values = graphData?.[centralityKey] ?? [];
  const topN = useAtomValue(topShowDataBar);
  const chartRef = useRef<HTMLDivElement>(null);

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

  const data = useMemo(() => {
    const mapped = values.map((value, index) => ({
      node: nodes[index] ?? `Node ${index}`,
      centrality: Number(value.toPrecision(3)), // max 3 significant digits
    }));

    // sort descending
    const sorted = mapped.sort((a, b) => b.centrality - a.centrality);

    // slice topN
    let topCount = topN ?? 10;
    if (topCount > sorted.length) topCount = sorted.length;

    return sorted.slice(0, topCount);
  }, [values, nodes, topN]);

  const hasData = data.some((d) => d.centrality > 0);

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
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        ) : hasData ? (
          <div className="flex-1 w-full overflow-auto">
            <div className="min-w-[1200px] h-[75vh]">
              <CentralityBarComponent
                data={data}
                chartFilter={{
                  ...chartFilter,
                  topMargin: 40,
                  rightMargin: 40,
                  bottomMargin: 120,
                  leftMargin: 150,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            All Values or Zero
          </div>
        )}
      </div>

      <Modal
             ref={chartRef}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        // className="w-4/5 max-w-[1600px]"
        size="full"
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
            <Button variant="light" color="primary" onPress={handletoImage}>
              Export
            </Button>
          </ModalHeader>

          <ModalBody className="">
            <div

              className="overflow-auto flex gap-4"
              style={{ maxHeight: "75vh" }}
            >
              <div   className={showFilter ? "w-3/4" : "w-full"}>
                <div   className="flex justify-center items-start text-center mb-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">{chartFilter.title}</p>
                    <p className="text-sm font-light">
                      {chartFilter.description}
                    </p>
                    <p className="text-sm font-light italic">
                      {chartFilter.author}
                    </p>
                  </div>
                </div>
                <CentralityBarComponent
                  data={data}
                  chartFilter={{
                    ...chartFilter,
                    topMargin: 40,
                    leftMargin: 120,
                    rightMargin: 40,
                    bottomMargin: 100,
                  }}
                />
              </div>

              {showFilter && (
                <div className="w-1/4">
                  <FilterPanelBarChart
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
