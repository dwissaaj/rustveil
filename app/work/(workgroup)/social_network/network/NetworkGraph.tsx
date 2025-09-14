"use client";
import { useRef } from "react";
import { Button, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { FitViewOutline, FullScreenIcon, ZoomInOutline, ZoomOutOutline } from "@/components/icon/IconView";
import NetworkCanvasReagraph, { NetworkCanvasHandle } from "../../../../../components/workstation/sna/network/reagraph/NetworkCanvasReagraph";

export default function NetworkGraph() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const canvasRef = useRef<NetworkCanvasHandle>(null);

  return (
    <div className="bg-content1 shadow-md border-1 dark:border-0 rounded-lg">
      <div className="p-2 font-medium flex flex-row justify-start gap-4 items-center">
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
      </div>

      {/* Main graph */}
      <div className="p-2">
        <NetworkCanvasReagraph ref={canvasRef} />
      </div>

      {/* Modal */}
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Network</ModalHeader>
              <ModalBody className="overflow-hidden">
                <NetworkCanvasReagraph ref={canvasRef} />
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
