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
import { PieFilterState, showFilterAtom, topShowDataPie } from "./state";
import {
  selectedCentrality,
  selectedChart,
} from "@/app/lib/workstation/social/centrality/state";
import { FilterPanelPieChart } from "../../../../../components/workstation/sna/centrality/pie/FilterPanelPieChart";
import { CentralityPieComponent } from "../../../../../components/workstation/sna/centrality/pie/CentralityPieComponent";

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

  const topN = useAtomValue(topShowDataPie);
const data = useMemo(() => {
  const mapped = values
    .map((value, index) => ({
      id: nodes[index] ?? `Node ${index}`,
      label: nodes[index] ?? `Node ${index}`,
      value: Number(value.toPrecision(3)), // max 3 significant digits
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // slice topN directly
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

      <div className="flex-1 min-h-[500px]">
        {graphData === null || graphData === undefined ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        ) : hasData ? (
          <CentralityPieComponent data={data} chartFilter={chartFilter} />
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
                <div>
                  <p className="text-lg font-bold">{chartFilter.title}</p>
                  <p className="text-sm font-light">
                    {chartFilter.description}
                  </p>
                  <p className="text-sm font-light italic">
                    {chartFilter.author}
                  </p>
                </div>
                <div className="flex-1 h-[75vh]">
                  <CentralityPieComponent
                    data={data}
                    chartFilter={chartFilter}
                  />
                </div>
              </div>

              {showFilter && (
                <div className="w-1/4">
                  <FilterPanelPieChart
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
