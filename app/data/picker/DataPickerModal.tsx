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
import { useState } from "react";

import { useFileOpener } from "@/app/lib/data/new_data/useFileOpener";

import { useTableOpen } from "@/app/lib/data/new_data/useTableOpen";
import { useCloseModal } from "@/app/lib/data/useCloseModal";
import { useDatabaseProgress } from "@/app/lib/data/progress/useDatabaseProgress";
import { CloseActionIconOutline } from "@/components/icon/IconAction";
import SheetSelector from "@/components/data/SheetSelect";

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
      addToast({
        title: "Operation Error",
        description: `${error}`,
        color: "danger",
      });
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
      addToast({
        title: "Operation Error",
        description: `${error}`,
        color: "danger",
      });
      setopenProgress(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        closeButton={
          <Button
            isIconOnly
            className="bg-red-500"
            color="danger"
            startContent={<CloseActionIconOutline />}
            variant="light"
            onPress={closeModal}
          />
        }
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                  isDisabled={fileLoaded}
                  isLoading={isLoading}
                  variant="light"
                  onPress={openFile}
                >
                  {isLoading
                    ? "Loading..."
                    : fileLoaded
                      ? "File Loaded"
                      : "Get File"}
                </Button>
              </div>
              <div className="my-4">
                <SheetSelector />
              </div>
            </div>
            <div>
              {openProgress && (
                <div className="w-full flex-col gap-1 flex p-4">
                  <Progress
                    className="max-w-md"
                    color="primary"
                    label={`Process ${progress?.count}/${progress?.total_rows}`}
                    maxValue={progress?.total_rows}
                    showValueLabel={true}
                    value={progress?.count}
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            <Button
              color="primary"
              isDisabled={openButtonState}
              isLoading={isLoading}
              onPress={openTable}
            >
              Open Table
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
