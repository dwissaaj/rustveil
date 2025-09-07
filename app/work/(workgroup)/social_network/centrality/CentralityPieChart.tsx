"use client";

import { CalculateCentralityType } from "@/app/lib/workstation/social/calculate/state";
import { InfoIcon } from "@/components/icon/IconFilter";
import { FullScreenIcon } from "@/components/icon/IconView";
import { Select, SelectItem, Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Tooltip, ModalFooter } from "@heroui/react";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";

export function CentralityPieChart({
  graphData,
  centralityKey,
  topN = 20,
}: {
  graphData: CalculateCentralityType | null | undefined;
  centralityKey: keyof Omit<CalculateCentralityType, "node_map">;
  topN?: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const nodes = graphData?.node_map ?? {};
  const values = graphData?.[centralityKey] ?? [];

  const data = useMemo(() => {
    return values
      .map((value, index) => ({
        id: nodes[index] ?? `Node ${index}`,
        label: nodes[index] ?? `Node ${index}`,
        value,
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
  }, [values, nodes, topN]);

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="w-full flex flex-col gap-10 border rounded-xl p-4">
      <div className="font-medium flex flex-row justify-start gap-4 items-center">
        <Button variant="flat" isIconOnly startContent={<FullScreenIcon className="w-6" />} color="primary" onPress={onOpen}>
       
        </Button>
         <Tooltip content="Customize Chart in Full Screen Mode">
            <Button variant="flat" isIconOnly startContent={<InfoIcon className="w-6" />} color="primary"></Button>
        </Tooltip>
      </div>

      <div className="flex-1 min-h-[500px]">
        {graphData === null || graphData === undefined ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        ) : hasData ? (
          <ResponsivePie
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            All Values or Zero
          </div>
        )}
      </div>

      {/* fullscreen modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="outside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Fullscreen Chart</ModalHeader>
          <ModalBody>
            <div className="h-[75vh]">
              <ResponsivePie
                data={data}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
