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
  ButtonGroup,
  Tooltip,
} from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";

import { useSetTargetColumn } from "../../lib/sentiment_analysis/useSetTargetColumn";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
  targetSentimentCreatedAt,
} from "../../lib/sentiment_analysis/state";

import { columnAvailable } from "@/app/lib/data/state";
import { CloseActionIconOutline } from "@/components/icon/IconAction";
import { supportedLang } from "@/app/lib/sentiment_analysis/supportedLang";

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
  const column = useAtomValue(columnAvailable);

  const [textTargetSentiment, setTextTargetSentiment] = useAtom(
    columnTargetSentimentAnalysis
  );
  const [languageTarget, setLanguageTarget] = useAtom(selectedLang);
  const createdAt = useAtomValue(targetSentimentCreatedAt);
  const setcolumn = useSetTargetColumn();
  const handleColumn = async () => {
    try {
      const result = await setcolumn();

      if (result?.response_code === 200) {
        addToast({
          title: "Set Column Success",
          description: `Target Column saved at ${result.column_target} with language ${result.languageTarget}`,
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
              <div className="flex flex-col gap-4">
                <div>
                  <Tooltip
                    className="capitalize"
                    color="secondary"
                    content="Current target based on uploaded data"
                  >
                    <ButtonGroup>
                      <Button>{textTargetSentiment}</Button>
                      <Button>{languageTarget}</Button>
                      <Button>{createdAt.slice(0, 10)}</Button>
                    </ButtonGroup>
                  </Tooltip>
                </div>
                <Select
                  className="max-w-lg"
                  color="primary"
                  label="Target Contain Text"
                  labelPlacement="outside"
                  placeholder="Choose a column"
                  value={textTargetSentiment}
                  variant="underlined"
                  onChange={(event) => {
                    const value = event.target.value;

                    setTextTargetSentiment(value);
                  }}
                >
                  {column.map((col) => (
                    <SelectItem key={col}>{col}</SelectItem>
                  ))}
                </Select>
                <Select
                  className="max-w-lg"
                  color="primary"
                  label="Language Identification"
                  labelPlacement="outside"
                  placeholder="Choose a Language"
                  value={languageTarget}
                  variant="underlined"
                  onChange={(event) => {
                    const value = event.target.value;
                    setLanguageTarget(value);
                  }}
                >
                  {supportedLang.map((lang) => (
                    <SelectItem key={lang.key} textValue={lang.key}>
                      {lang.label}
                    </SelectItem>
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
              color="primary"
              isDisabled={!textTargetSentiment}
              onPress={handleColumn}
            >
              Choose Column
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
