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
import { graphTypeAvailable, vertex1ColumnSelected, vertex2ColumnSelected } from "@/app/lib/workstation/data/state";
import { useGetBetweness } from "@/app/lib/workstation/social/GetBetweness";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Code,
  Tooltip,
} from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";

type CalculateModal = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function SocialCalculateModal({
  isOpen,
  onOpenChange,
}: CalculateModal) {
  const closeModal = () => {
    onOpenChange();
  };
  const vertex1Column = useAtomValue(vertex1ColumnSelected);
  const vertex2Column = useAtomValue(vertex2ColumnSelected);
  const getData = useGetBetweness()
  const [graphType, setgraphType] = useAtom(graphTypeAvailable);
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl text-primary-500">
               Calculate Centrality
              </ModalHeader>
              <ModalBody >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 items-start">
                      <div>
                        <Tooltip content="Read more for the different">
                          <Button>Graph Type Connection</Button>
                      </Tooltip>
                      </div>
                      <div>
                        <RadioGroup size="md" orientation="horizontal">
                        <Radio value="direct">Direct</Radio>
                        <Radio value="undirect">Undirect</Radio>
                      </RadioGroup>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <Tooltip content="If you didn't see this try to upload a data">
                          <Button>Selected Column</Button>
                      </Tooltip>
                      </div>
                      <div className="flex flex-row gap-4">
                        <Code color="primary">{vertex1Column}</Code>
                        <Code color="secondary">{vertex2Column}</Code>
                      </div>
                    </div>
                </div>
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
