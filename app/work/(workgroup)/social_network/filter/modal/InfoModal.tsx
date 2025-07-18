"use client";

import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Code,
} from "@heroui/react";

type SocialNetworkReportModal = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function InfoModal({
  isOpen,
  onOpenChange,
}: SocialNetworkReportModal) {
  const { vertex1, vertex2, vertex1Data, vertex2Data, graphType } =
    useGraphData();

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Your Social Network Report
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="m-4 flex flex-col gap-4">
                    <div>
                      <p className="text-2xl">Your Selected Column</p>
                    </div>
                    <div className="flex flex-row gap-4 m-4">
                      <Code color="primary">{vertex1}</Code>
                      <Code color="secondary">{vertex2}</Code>
                    </div>
                  </div>
                  <div className="m-4 flex flex-col gap-4">
                    <div>
                      <p className="text-2xl">Graph Type</p>
                    </div>
                    <div className="flex flex-row gap-4 m-4">
                      <Code color="primary">{graphType}</Code>
                    </div>
                  </div>
                  <div className="m-4 flex flex-col gap-4">
                    <div>
                      <p className="text-2xl">Total Data</p>
                    </div>
                    <div className="flex flex-row gap-4 m-4">
                      <Code color="primary">{vertex1Data?.length}</Code>
                      <Code color="secondary">{vertex2Data?.length}</Code>
                    </div>
                  </div>
                </div>
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
    </>
  );
}
