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
} from "@heroui/react";
import { CloseActionIconOutline } from "@/components/icon/IconAction";
import { useAtom } from "jotai";
import {
  columnAvailable,
} from "@/app/lib/data/state";
import { useSetTargetColumn } from "../../lib/sentiment_analysis/useSetTargetColumn";
import { columnTargetSentimentAnalysis } from "../state";

type PickColumnModalType = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

export default function PickColumnModal({
  isOpen,
  onOpenChange,
  onClose,
}: PickColumnModalType) {
  const [column] = useAtom(columnAvailable);
  const [textTargetSentiment, seTextTargetSentiment] = useAtom(
    columnTargetSentimentAnalysis,
  );
  const setcolumn = useSetTargetColumn();
  const handleColumn = async () => {
    try {
      const result = await setcolumn();
      if (result?.response_code === 200) {
        addToast({
          title: "Set Column Success",
          description: `Target Column saved at ${result.target}`,
          variant: "bordered",
          color: "success",
        });
        onClose();
      } else {
        addToast({
          title: "Set Column Error",
          description: `Error at ${result?.message}`,
          variant: "bordered",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Set Column Error",
        description: `Error at ${error}`,
        variant: "bordered",
        color: "danger",
      });
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
            onPress={onClose}
          />
        }
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-medium">Choose Column Text</p>
            </div>
          </ModalHeader>
          <ModalBody className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                <Select
                  className="max-w-lg"
                  label="Target Contain Text"
                  placeholder="Choose a column"
                  variant="underlined"
                  color="primary"
                  labelPlacement="outside"
                  value={textTargetSentiment}
                  onChange={(event) => {
                    const value = event.target.value;
                    seTextTargetSentiment(value);
                  }}
                >
                  {column.map((col) => (
                    <SelectItem key={col}>{col}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              isDisabled={!textTargetSentiment}
              onPress={handleColumn}
              color="primary"
            >
              Choose Column
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
