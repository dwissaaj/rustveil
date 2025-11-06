"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
  Progress,
} from "@heroui/react";
import { CloseActionIconOutline } from "@/components/icon/IconAction";
import ListLang from "./component/ListLang";
import { useSentimentAnalysis } from "../../lib/sentiment_analysis/useSentimentAnalysis";

import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "@/app/lib/sentiment_analysis/state";

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
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);
  const languageTarget = useAtomValue(selectedLang);
  const [analyzeBtn, setAnalyzeBtn] = useState({ isLoading: false });
  const isDisabled = !columnTarget || !languageTarget || analyzeBtn.isLoading;
  const sentiment = useSentimentAnalysis();
  const handlePress = async () => {
    setAnalyzeBtn({ isLoading: true });
    addToast({
      title: "Analyzing Data",
      description: (
        <div>
          <p>Please wait, larger dataset have longer process...</p>
          <Progress
            isIndeterminate
            aria-label="Loading..."
            className="max-w-md"
            size="sm"
          />
        </div>
      ),
      variant: "bordered",
      color: "primary",
      timeout: 3000,
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const result = await sentiment();

      if (result?.response_code === 200) {
        addToast({
          title: "Processing Sentiment Complete",
          description: `Total Processed ${result.total_data}, with positive ${result.total_positive_data} and negative ${result.total_negative_data}`,
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
    } finally {
      setAnalyzeBtn({ isLoading: false });
    }
  };

  return (
    <>
      <Modal
        size="2xl"
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
              <p className="text-3xl font-medium">Setting Model</p>
            </div>
          </ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <ListLang />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              isDisabled={isDisabled}
              isLoading={analyzeBtn.isLoading}
              onPress={handlePress}
              color="primary"
            >
              Analyze
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
