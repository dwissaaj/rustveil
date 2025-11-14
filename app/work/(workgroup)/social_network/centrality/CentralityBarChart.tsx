"use client";

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
import { useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { FilterPanelBarChart } from "../../../../../components/workstation/sna/centrality/bar/FilterControlBarChart";
import { CentralityBarComponent } from "../../../../../components/workstation/sna/centrality/bar/CentralityBarComponent";
import { useExportToImage } from "../../../../lib/workstation/social/useExportToImage";

import { BarFilterState, showFilterAtom, topShowDataBar } from "./state";

import { CalculateCentralityType } from "@/app/lib/workstation/social/calculate/state";
import { FilterIcon, InfoIcon } from "@/components/icon/IconFilter";
import { FullScreenIcon } from "@/components/icon/IconView";
import {
  selectedCentrality,
  selectedChart,
} from "@/app/lib/workstation/social/centrality/state";
import NoDataChartComponent from "@/components/workstation/sna/centrality/NoDataChartComponent";
import AllZeroComponent from "@/components/workstation/sna/centrality/AllZeroComponent";

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

      <div className="flex-1 w-full">
        {graphData === null || graphData === undefined ? (
          <NoDataChartComponent />
        ) : hasData ? (
          <div className="flex-1 w-full ">
            <div className="min-w-[1200px] h-[75vh]">
              <CentralityBarComponent
                chartFilter={{
                  ...chartFilter,
                  topMargin: 40,
                  rightMargin: 40,
                  bottomMargin: 120,
                  leftMargin: 150,
                }}
                data={data}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <AllZeroComponent />
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
            {chart.toUpperCase()} - {centrality.toUpperCase()}
            <Button
              isIconOnly
              color="default"
              startContent={<FilterIcon className="w-4" />}
              variant="light"
              onPress={() => setshowFilter(!showFilter)}
            />
          </ModalHeader>

          <ModalBody>
            <div className="flex gap-4">
              <div className={showFilter ? "w-3/4" : "w-full"}>
                <div
                  ref={chartRef}
                  style={{
                    background: theme === "dark" ? "#18181b" : "#ffffff",
                  }}
                >
                  <div className="flex flex-col gap-2 text-center mb-4">
                    <p className="text-lg font-bold">{chartFilter.title}</p>
                    <p className="text-sm font-light">
                      {chartFilter.description}
                    </p>
                    <p className="text-sm font-light italic">
                      {chartFilter.author}
                    </p>
                  </div>

                  <CentralityBarComponent
                    chartFilter={{
                      ...chartFilter,
                      topMargin: 40,
                      leftMargin: 120,
                      rightMargin: 40,
                      bottomMargin: 100,
                    }}
                    data={data}
                  />
                </div>
              </div>

              {showFilter && (
                <div className="w-1/4 " style={{ maxHeight: "75vh" }}>
                  <FilterPanelBarChart
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
