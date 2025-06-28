"use client";

import { tableData,  } from "@/app/lib/workstation/data/state";
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
import { columnPickSheetVertices } from "@/app/lib/workstation/social/GetVertices";

type VerticesModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function VerticesModal({
  isOpen,
  onOpenChange,
}: VerticesModalProps) {


  const closeModal = () => {
    onOpenChange();
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
                  Load Table
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
