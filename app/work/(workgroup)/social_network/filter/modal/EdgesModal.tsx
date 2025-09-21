"use client";

import { useAtomValue } from "jotai";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";

import {
  vertex1ColumnSelected,
  vertex2ColumnSelected,
} from "@/app/lib/data/state";
import { useSetVertices } from "@/app/lib/workstation/social/vertices/useSetVertices";
import VerticesSelect from "@/components/workstation/sna/centrality/VerticesSelectComponent";

type VerticesModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function EdgesModal({
  isOpen,
  onOpenChange,
}: VerticesModalProps) {
  const setvertices = useSetVertices();
  const vertex1 = useAtomValue(vertex1ColumnSelected);
  const vertex2 = useAtomValue(vertex2ColumnSelected);
  const closeModal = async () => {
    try {
      const response = await setvertices();

      if (response?.response_code === 200) {
        addToast({
          title: "Setting Vertices Success",
          description: `${response?.message} ${vertex1} and ${vertex2}`,
          color: "success",
        });
        onOpenChange();
      }

      if (response?.response_code !== 200) {
        addToast({
          title: "Operation Error",
          description: `${response?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Operation Error",
        description: `${error}`,
        color: "danger",
      });
    }
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
                <VerticesSelect />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={closeModal}>
                  Choose
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
