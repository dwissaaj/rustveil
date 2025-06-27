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
import { UploadIcon } from "@/components/icon/IconFilter";
/**
 * A modal-based component for selecting and processing Excel (.xlsx) files with sheet selection
 * 
 * @component
 * @example
 * // Basic usage
 * <DataPicker />
 * 
 * @description
 * Features:
 * - Two-step workflow: file selection → sheet selection → table loading
 * - Built with Hero UI modal and button components
 * - Handles Excel file parsing and sheet selection
 * - Clean separation of file and table operations
 * 
 * @ui
 * - Modal dialog with header, body and footer sections
 * - Primary action buttons for file/table operations
 * - Secondary button for cancellation
 * - Responsive layout with consistent spacing
 * 
 * @workflow
 * 1. User clicks "Open File" button
 * 2. Modal opens with file selection options
 * 3. User selects .xlsx file
 * 4. Sheet selector becomes available
 * 5. User selects sheet and clicks "Open Table"
 * 6.
 * 
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
    await tableOpener(); 
  };

  return (
    <div className="w-full ">
      <Button endContent={< UploadIcon />} className="w-full" color="secondary" variant="bordered" onPress={onOpen}>
        Open File
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Data & Sheet</ModalHeader>
              <ModalBody className="flex flex-col gap-2">
                <div>
                  <div className="flex flex-col gap-2 ">
                    <p>Pick a .xlsx file</p>
                    <Button color="secondary" variant="light" onPress={openFile}>
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