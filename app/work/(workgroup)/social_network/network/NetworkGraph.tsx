"use client";

import { useRef, useState } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  FitViewOutline,
  FullScreenIcon,
  RefreshIcon,
  ZoomInOutline,
  ZoomOutOutline,
} from "@/components/icon/IconView";
import NetworkCanvasReagraph, {
  NetworkCanvasHandle,
  LAYOUT_OPTIONS,
  CENTRALITY_OPTIONS,
} from "../../../../../components/workstation/sna/network/reagraph/NetworkCanvasReagraph";
import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { CentralityKey } from "@/app/lib/workstation/social/centrality/state";

export default function NetworkGraph() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const canvasRef = useRef<NetworkCanvasHandle>(null);
  const [layout, setLayout] = useState("forceDirected2d");
  const [centrality, setCentrality] = useState<CentralityKey>(
    "betweenness_centrality"
  );
  const handleRefreshGraph = useRefreshGraph();
  return (
    <div className="bg-content1 shadow-md border-1 dark:border-0 rounded-lg">
      <div className="p-2 font-medium flex flex-row justify-start gap-4 items-center">
        <Button
          variant="flat"
          isIconOnly
          startContent={<RefreshIcon className="w-6" />}
          color="primary"
          onPress={handleRefreshGraph}
        />
        <Button
          variant="flat"
          isIconOnly
          startContent={<FullScreenIcon className="w-6" />}
          color="primary"
          onPress={onOpen}
        />
        <Button
          variant="flat"
          isIconOnly
          startContent={<FitViewOutline className="w-6" />}
          color="primary"
          onPress={() => canvasRef.current?.fitView()}
        />
        <Button
          variant="flat"
          isIconOnly
          startContent={<ZoomInOutline className="w-6" />}
          color="primary"
          onPress={() => canvasRef.current?.zoomIn()}
        />
        <Button
          variant="flat"
          isIconOnly
          startContent={<ZoomOutOutline className="w-6" />}
          color="primary"
          onPress={() => canvasRef.current?.zoomOut()}
        />

        {/* Hero UI Select */}
        <Select
          className="max-w-xs"
          label="Graph Layout"
          placeholder="Select layout"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
        >
          {LAYOUT_OPTIONS.map((o) => (
            <SelectItem key={o.value}>{o.label}</SelectItem>
          ))}
        </Select>
        <Select
          className="max-w-xs"
          label="Centrality Metric"
          placeholder="Select metric"
          value={centrality}
          onChange={(e) => setCentrality(e.target.value as CentralityKey)}
        >
          {CENTRALITY_OPTIONS.map((o) => (
            <SelectItem key={o.value}>{o.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="p-2">
        <NetworkCanvasReagraph ref={canvasRef} layout={layout as any} />
      </div>

      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Network</ModalHeader>
              <ModalBody className="overflow-hidden">
                <NetworkCanvasReagraph ref={canvasRef} layout={layout as any} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
