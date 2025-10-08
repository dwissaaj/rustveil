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
} from "@/app/lib/data/state";
import ListLang from "./component/ListLang";
import { InfoIconSolid } from "@/components/icon/IconView";
import { InfoIcon } from "@/components/icon/IconFilter";

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
              <div className="flex flex-col gap-2"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <Tooltip
                  color="primary"
                  content="Click model For explanation"
                  placement="top"
                >
                  <Button
                    variant="light"
                    endContent={<InfoIcon className="w-6" color="secondary" />}
                    className="text-lg"
                  >
                    Pick a suitable language
                  </Button>
                </Tooltip>
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
            <Button color="primary">Choose Model</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
