"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
  addToast,
} from "@heroui/react";
import { useFileOpener } from "@/app/lib/workstation/data/new_data/useFileOpener";
import SheetSelector from "@/components/workstation/data/SheetSelect";
import { useTableOpen } from "@/app/lib/workstation/data/new_data/useTableOpen";
import { useState } from "react";
import { useCloseModal } from "@/app/lib/workstation/data/useCloseModal";
import { useDatabaseProgress } from "@/app/lib/workstation/data/progress/useDatabaseProgress";
import {
  CloseActionIcon,
  CloseActionIconOutline,
} from "@/components/icon/IconAction";

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
      if (result?.response_code === 200) {
        addToast({
          title: "Table Opened",
          description: `${result?.message}`,
          color: "success",
        });
      }
      if (result?.response_code !== 200) {
        addToast({
          title: "Operation Error",
          description: `${result?.message}`,
          color: "danger",
        });
        setopenProgress(false);
      }
    } catch (error) {
      setopenProgress(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton={
          <Button
            className="bg-red-500"
            startContent={<CloseActionIconOutline />}
            isIconOnly
            onPress={closeModal}
            color="danger"
            variant="light"
          ></Button>
        }
      >
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
