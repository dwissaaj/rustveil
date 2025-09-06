/**
 * Modal dialog for vertex selection in social network analysis
 *
 * @component
 * @example
 * <VerticesModal isOpen={isOpen} onOpenChange={toggleOpen} />
 *
 * @description
 * Provides a controlled modal interface containing:
 * - Column selection UI (ColumnSelect component)
 * - Confirm/cancel actions
 * - Blurred backdrop effect
 *
 * @props {
 *   isOpen: boolean - Controls modal visibility
 *   onOpenChange: () => void - Toggle handler
 * }
 *
 * @ui
 * - Hero UI Modal components
 * - Blurred backdrop
 * - Fixed header/footer layout
 * - Danger (close) and primary (confirm) action buttons
 *
 * @behavior
 * - Closes on both button actions
 * - State managed by parent component
 * - Embeds ColumnSelect for vertex picking
 *
 * @dependencies
 * - @hero-ui/react Modal system
 * - ColumnSelect child component
 */
"use client";
import {
  vertex1ColumnSelected,
  vertex2ColumnSelected,
} from "@/app/lib/workstation/data/state";
import { useSetVertices } from "@/app/lib/workstation/social/vertex/useSetVertices";
import VerticesSelect from "@/components/workstation/sna/vertices/VerticesSelectComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { useAtomValue } from "jotai";

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
      console.log(error);
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
