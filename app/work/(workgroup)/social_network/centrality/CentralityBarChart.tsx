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
} from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  BarFilterState,
  PieFilterState,
  showFilterAtom,
  topShowDataBar,
} from "./state";
import {
  selectedCentrality,
  selectedChart,
} from "@/app/lib/workstation/social/centrality/state";
import { ResponsiveBar } from "@nivo/bar";
import { FilterPanelBarChart } from "./FilterControlBarChart";
import { CentralityBarComponent } from "./CentralityBarComponent";

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
          <CentralityBarComponent data={data} chartFilter={chartFilter} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            All Values or Zero
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
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

          <ModalBody className="">
            <div className="p-2 flex flex-row w-full gap-4 ">
              <div className={showFilter ? "w-3/4" : "w-full"}>
                <div className="flex justify-center items-start text-center">
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
                <div className="flex-1 h-[75vh]">
                  <CentralityBarComponent
                    data={data}
                    chartFilter={chartFilter}
                  />
                </div>
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
