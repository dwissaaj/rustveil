"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";

import { useCloseModal } from "@/app/lib/workstation/data/useCloseModal";
import { useLoadDatabase } from "@/app/lib/workstation/data/load_data/useLoadDatabase";
import { useOpenDatabase } from "@/app/lib/workstation/data/load_data/useOpenDatabase";
import { InfoIconSolid } from "@/components/icon/IconView";
import { CloseActionIconOutline } from "@/components/icon/IconAction";

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
}: DataPickerModalType) {
  const [openButtonState, setopenButtonState] = useState(true);
  const { closeModal } = useCloseModal(onOpenChange, addToast);
  const [isLoading, setIsLoading] = useState(false);
  const loadDatabase = useLoadDatabase();
  const databaseOpener = useOpenDatabase();
  const openDatabase = async () => {
    try {
      const result = await databaseOpener();

      setIsLoading(true);
      if (result?.response_code === 200) {
        addToast({
          title: "All Set! Data imported",
          description: "Your data is loaded. Go to View > Refresh to see it.",
          color: "success",
        });
      }
      if (result?.response_code !== 200) {
        addToast({
          title: "Operation Error",
          description: `${result?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Operation Error",
        description: `${error}`,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFile = async () => {
    setIsLoading(true);
    try {
      const result = await loadDatabase();

      if (result?.isSelected === true) {
        setopenButtonState(false);
      }
    } catch (error) {
      addToast({
        title: "Operation Error",
        description: `${error}`,
        color: "danger",
      });
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
            <div className="flex items-center gap-2">
              <p className="text-2xl font-medium">Load A Sqlite Database</p>
              <Tooltip content="Only Generated Sqlite database by Rust Veil is supported for now">
                <Button
                  isIconOnly
                  color="warning"
                  size="sm"
                  startContent={<InfoIconSolid />}
                  variant="light"
                />
              </Tooltip>
            </div>
          </ModalHeader>
          <ModalBody className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                <Button
                  color="secondary"
                  isDisabled={fileLoaded}
                  isLoading={isLoading}
                  variant="light"
                  onPress={handleOpenFile}
                >
                  Pick the sqlite
                </Button>
              </div>
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
              onPress={openDatabase}
            >
              Open Database
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
