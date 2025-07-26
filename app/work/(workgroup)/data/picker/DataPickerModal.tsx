"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
} from "@heroui/react";
import { useFileOpener } from "@/app/lib/workstation/data/useFileOpener";
import SheetSelector from "@/components/workstation/data/SheetSelect";
import { useTableOpen } from "@/app/lib/workstation/data/useTableOpen";
import { ErrorIcon } from "@/components/icon/IconFilter";
import { useState } from "react";
import { useCloseModal } from "@/app/lib/workstation/data/useCloseModal";

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
  const [openButtonState, setopenButtonState] = useState(true);
  const { closeModal } = useCloseModal(onOpenChange);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    isError: boolean;
    message?: string;
  }>({ isError: false });

  const openFile = async () => {
    try {
      setIsLoading(true);
      const file = await fileOpener();
      if (file?.isSelected === true) {
        setopenButtonState(false);
      }
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
        <ModalHeader className="flex flex-col gap-1">Data & Sheet</ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <div>
            <div className="flex flex-col gap-2">
              <p>Pick a .xlsx file</p>
              <Button
                color="secondary"
                variant="light"
                onPress={openFile}
                isLoading={isLoading}
                isDisabled={fileLoaded}
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
          <Button onPress={closeModal} color="danger" variant="light">
            Close
          </Button>
          <Button
            color="primary"
            onPress={openTable}
            isDisabled={openButtonState}
            isLoading={isLoading}
          >
            Open Table
          </Button>

          <Alert
            startContent={<ErrorIcon />}
            title={errorInfo.message}
            isVisible={errorInfo.isError}
            color="danger"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
