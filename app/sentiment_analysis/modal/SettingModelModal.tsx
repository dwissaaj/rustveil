"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
  Select,
  SelectItem,
  Chip,
  Tooltip,
} from "@heroui/react";
import { CloseActionIconOutline } from "@/components/icon/IconAction";
import { useAtom, useAtomValue } from "jotai";
import {
  columnAvailable,
  columnTargetSentimentAnalysis,
} from "@/app/lib/data/state";
import ListLang from "./ListLang";

type PickColumnModalType = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

export default function SettingModel({
  isOpen,
  onOpenChange,
  onClose,
}: PickColumnModalType) {


  return (
    <>
      <Modal
      size="xl"
        closeButton={
          <Button
            isIconOnly
            className="bg-red-500"
            color="danger"
            startContent={<CloseActionIconOutline />}
            variant="light"
            onPress={onClose}
          />
        }
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-3xl font-medium">Target Column</p>
            </div>
          </ModalHeader>
          <ModalBody className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-lg">Pick a suitable language</h2>
              </div>
              <div>
                <ListLang />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary">Choose Column</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
