"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  Progress,
  addToast,
} from "@heroui/react";
import { useFileOpener } from "@/app/lib/workstation/data/new_data/useFileOpener";
import SheetSelector from "@/components/workstation/data/SheetSelect";
import { useTableOpen } from "@/app/lib/workstation/data/new_data/useTableOpen";
import { ErrorIcon } from "@/components/icon/IconFilter";
import { useState, useEffect } from "react";
import { useCloseModal } from "@/app/lib/workstation/data/useCloseModal";
import { useDatabaseProgress } from "@/app/lib/workstation/data/progress/useDatabaseProgress";
import { useLoadDatabase } from "@/app/lib/workstation/data/load_data/useLoadDatabase";


type DataPickerModalType = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileLoaded: boolean;
  setFileLoaded: (loaded: boolean) => void;
};

export default function DataLoader({
  isOpen,
  onOpenChange,
  fileLoaded,
  setFileLoaded,
}: DataPickerModalType) {

  const [openButtonState, setopenButtonState] = useState(true);
const { closeModal } = useCloseModal(onOpenChange, addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    isError: boolean;
    message?: string;
  }>({ isError: false });
const loadDatabase = useLoadDatabase();
const handleOpenFile = async () => {
    setIsLoading(true);
    try {
      const result = await loadDatabase();
      console.log(result)
    } catch (error) {
      console.error("Failed to load database:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Load A Sqlite Database
          </ModalHeader>
          <ModalBody className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                <Button
                  color="secondary"
                  variant="light"
                  onPress={handleOpenFile}
                  isLoading={isLoading}
                  isDisabled={fileLoaded}
                >
                  Pick the file
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={closeModal} color="danger" variant="light">
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleOpenFile}
              isDisabled={openButtonState}
              isLoading={isLoading}
            >
              Open Database
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
