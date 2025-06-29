"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  addToast,
  Alert,
} from "@heroui/react";
import { useFileOpener } from "@/app/lib/workstation/data/useFileOpener";
import SheetSelector from "@/components/workstation/data/SheetSelect";
import { useTableOpen } from "@/app/lib/workstation/data/useTableOpen";
import { ErrorIcon, UploadIcon } from "@/components/icon/IconFilter";
import { useState } from "react";
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

type DataPickerModalType = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileLoaded: boolean;
  setFileLoaded: (loaded: boolean) => void;
};

export default function DataPicker({
  isOpen,
  onOpenChange,
  fileLoaded,
  setFileLoaded,
}: DataPickerModalType) {
  const fileOpener = useFileOpener();
  const tableOpener = useTableOpen();
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    isError: boolean;
    message?: string;
  }>({ isError: false });

  const openFile = async () => {
    try {
      setIsLoading(true);
      await fileOpener();
      setFileLoaded(true);
    } catch (error) {
      setFileLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const openTable = async () => {
    try {
      const result = await tableOpener();
      setIsLoading(true);
      if (result?.status === 404) {
        setErrorInfo({ isError: true, message: `${result.error}` });
      }
      if (result?.status === 200) {
        onOpenChange(false);
      }
    } catch (error) {
      setErrorInfo({ isError: true, message: "Error at picking sheet" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Data & Sheet
            </ModalHeader>
            <ModalBody className="flex flex-col gap-2">
              <div>
                <div className="flex flex-col gap-2">
                  <p>Pick a .xlsx file</p>
                  <Button
                    color="secondary"
                    variant="light"
                    onPress={openFile}
                    isLoading={isLoading}
                    isDisabled={isLoading || fileLoaded}
                  >
                    {isLoading
                      ? "Loading..."
                      : fileLoaded
                        ? "File Loaded"
                        : "Get File"}
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
              <Button
                color="primary"
                onPress={openTable}
                isDisabled={!fileLoaded || isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Opening..." : "Open Table"}
              </Button>

              <Alert
                startContent={<ErrorIcon />}
                title={errorInfo.message}
                isVisible={errorInfo.isError}
                color="danger"
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
