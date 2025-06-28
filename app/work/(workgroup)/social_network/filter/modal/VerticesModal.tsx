"use client";

import { tableData } from "@/app/lib/workstation/data/state";
import { useColumnShow } from "@/app/lib/workstation/social/GetColumn";
import { VerticesIcon } from "@/components/icon/IconFilter";
import ColumnSelect from "@/components/workstation/sna/ColumnSelect";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { atom, useAtomValue } from "jotai";
import DataTable from "../../../data/table/DataTable";
import { getColumnValuesAtom } from "@/app/lib/workstation/social/GetVertices";

type VerticesModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function VerticesModal({
  isOpen,
  onOpenChange,
}: VerticesModalProps) {
  const { onOpen, onClose } = useDisclosure();

  const column = useColumnShow();
  const datafilter = getColumnValuesAtom;
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useColumnShow();
  const sentimentLabels = useAtomValue(getColumnValuesAtom);
  const openModal = async () => {
    onOpen();
    try {
      console.log(column);
    } catch (error) {
      console.log("Error at column pick");
    }
  };
  const closeModal = async () => {
    console.log("data filtered", sentimentLabels);
    onClose();
  };
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Pick For Vertices
              </ModalHeader>
              <ModalBody>
                <ColumnSelect />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={closeModal}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
