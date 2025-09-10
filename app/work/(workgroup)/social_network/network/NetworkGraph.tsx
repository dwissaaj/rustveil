"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import NetworkGraphViewer from "@/components/workstation/sna/network/NetworkGraphViewer";
import { FullScreenIcon } from "@/components/icon/IconView";


export default function NetworkGraph() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="bg-content1 shadow-md border-1 dark:border-0 rounded-lg">
      <div className="p-2 font-medium flex flex-row justify-start gap-4 items-center">
        <Button
          variant="flat"
          isIconOnly
          startContent={<FullScreenIcon className="w-6" />}
          color="primary"
          onPress={onOpen}
        ></Button>
      </div>
      <div className="">
        <NetworkGraphViewer />
      </div>
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Network</ModalHeader>
              <ModalBody className="overflow-hidden">
                <NetworkGraphViewer />
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
