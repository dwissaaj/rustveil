"use client";
import { vertex1ColumnData, vertex1ColumnSelected, vertex2ColumnData, vertex2ColumnSelected, vertexGraphTypeSelected } from "@/app/lib/workstation/data/state";
import { useGetBetweness } from "@/app/lib/workstation/social/GetBetweness";
import ColumnSelect from "@/components/workstation/sna/ColumnSelect";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Snippet,
  Code,
} from "@heroui/react";
import { useAtomValue } from "jotai";

type SocialNetworkReportModal = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function InfoModal({
  isOpen,
  onOpenChange,
}: SocialNetworkReportModal) {
  const closeModal = () => {
    onOpenChange();
  };
  const vertex1 = useAtomValue(vertex1ColumnSelected);
  const vertex2 = useAtomValue(vertex2ColumnSelected);
  const vertex1Data = useAtomValue(vertex1ColumnData);
  const vertex2Data = useAtomValue(vertex2ColumnData);
  const graphType = useAtomValue(vertexGraphTypeSelected)
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
