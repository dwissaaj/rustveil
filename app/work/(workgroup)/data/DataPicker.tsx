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
import { useFileOpener } from "@/app/lib/workstation/data/GetFile";
import SheetSelector from "@/components/workstation/data/SheetSelect";
import { useTableOpen } from "@/app/lib/workstation/data/OpenTable";

/**
 * A modal-based component for selecting and opening Excel files and sheets.
 *
 * @component
 * @returns {JSX.Element} The rendered DataPicker UI
 *
 * @description
 * Features:
 * - Opens a modal dialog with options to pick a `.xlsx` file and a sheet.
 * - Uses custom hooks `useFileOpener` and `useTableOpen` to handle file selection and table loading logic.
 * - Integrates with Hero UI components (`Modal`, `Button`, etc.).
 *
 * @ui
 * - Modal interface with header, body, and footer
 * - Two-step flow: file selection → sheet selection → open table
 * - Clear separation of concerns between file and table operations
 *
 * @example
 * // Usage within a page or layout
 * <DataPicker />
 */

export default function DataPicker() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const fileOpener = useFileOpener();
  const tableOpener = useTableOpen(); // Move hook call to top level

  const openFile = async () => {
    onOpen();
    await fileOpener();
  };

  const openTable = async () => {
    onClose();
    await tableOpener(); // Now calling the returned function
  };

  return (
    <div className="">
      <Button color="primary" variant="light" onPress={onOpen}>
        Open File
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Data & Sheet
              </ModalHeader>
              <ModalBody className="flex flex-col gap-2">
                <div>
                  <div className="flex flex-col gap-2 ">
                    <p>Pick a .xlsx file</p>
                    <Button
                      color="secondary"
                      variant="light"
                      onPress={openFile}
                    >
                      Get File
                    </Button>
                  </div>
                  <div>
                    <SheetSelector />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={openTable}>
                  Open Table
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
