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
  const progress = useDatabaseProgress();
  const [openProgress, setopenProgress] = useState(false);
  const [openButtonState, setopenButtonState] = useState(true);
const { closeModal } = useCloseModal(onOpenChange, addToast);
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
      setopenProgress(true);
      if (result?.status === 404) {
        setErrorInfo({ isError: true, message: `${result.error}` });
      }
      if (result?.status === 200) {
        onOpenChange(false);
      }
    } catch (error) {
      setopenProgress(false);
      setErrorInfo({ isError: true, message: "Error at picking sheet" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
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
            <div>
              {openProgress && (
                <div className="w-full flex-col gap-1 flex p-4">
                  <Progress
                    className="max-w-md"
                    color="primary"
                    value={progress?.count}
                    maxValue={progress?.total_rows}
                    showValueLabel={true}
                    label={`Process ${progress?.count}/${progress?.total_rows}`}
                  />
                </div>
              )}
              {errorInfo.isError && (
                <div className="w-full flex-col gap-1 flex p-4">
                  <Alert
                    className="flex items-center"
                    icon={<ErrorIcon />}
                    title={errorInfo.message ?? "Something went wrong"}
                    isVisible={true}
                    color="danger"
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
           onPress={closeModal}
            color="danger" 
            variant="light">
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

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
