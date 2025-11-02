"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { CloseActionIconOutline } from "@/components/icon/IconAction";
import ListLang from "./component/ListLang";
import {
  useSentimentAnalysis,
  useSentimentTest,
} from "../../lib/sentiment_analysis/useSentimentAnalysis";
import ListColumn from "./component/ListColumn";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { columnTargetSentimentAnalysis, selectedLang } from "@/app/lib/sentiment_analysis/state";

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
  const [analyzeBtn, setanalyzeBtn] = useState({
    isLoading: false,
    isDisabled: false
  })
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis)
  const languageTarget = useAtomValue(selectedLang)
  const sentiment = useSentimentAnalysis();
  const senttest = useSentimentTest();
  const handlePress = async () => {
    try {
      const res = await sentiment();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
    useEffect(() => {
      if(columnTarget === "" ) {
        setanalyzeBtn({
          isLoading: false,
          isDisabled:  true
        })
      }
      if(languageTarget === "" ) {
        setanalyzeBtn({
          isLoading: false,
          isDisabled:  true
        })
      }
    }, [columnTarget,languageTarget]);
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
            <Button isDisabled={analyzeBtn.isDisabled} isLoading={analyzeBtn.isLoading} onPress={handlePress} color="primary">
              Analyze
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
