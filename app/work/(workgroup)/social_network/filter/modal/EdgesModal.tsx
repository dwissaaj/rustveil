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
import ColumnSelect from "@/components/workstation/sna/VerticesSelect";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Radio,
  RadioGroup
} from "@heroui/react";

type VerticesModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function EdgesModal({
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
