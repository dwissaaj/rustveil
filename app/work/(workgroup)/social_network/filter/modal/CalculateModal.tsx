"use client";
import {  vertex1ColumnSelected, vertex2ColumnSelected } from "@/app/lib/workstation/data/state";
import { useMapId } from "@/app/lib/workstation/social/useMapId";
import { MappingProgress, useMapProgress } from "@/app/lib/workstation/social/useMapProgress";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Code,
  Tooltip,
  Progress,
} from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

type CalculateModal = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function SocialCalculateModal({
  isOpen,
  onOpenChange,
}: CalculateModal) {

  const{ vertex1,vertex2, graphType , edgesValue, centralityValue} = useGraphData()
  const useCalculate = useMapId()
  const mapProgress = useMapProgress()
  const [buttonState, setButtonState] = useState<{
    isLoading: boolean;
    message: string;
    isDone: boolean;
    color: "primary" | "danger" | "secondary"
  }>({
    isLoading: false,
    message: "Calculate",
    isDone: false,
    color: "primary"
  });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const calculate = async () => {
    try {
      setButtonState({
      isLoading: true,
      message: "Initializing...",
      isDone: false,
      color: "primary"
    });
      await delay(1000); // Small initial delay
      const result = await useCalculate();
      await delay(1000);
    } catch (error) {
      console.log(error)
    } 
  };
  useEffect(() => {
    if (!mapProgress) return;
    console.log(mapProgress)
    const updateButton = async () => {
      if (mapProgress.isError) {
      await delay(2000)
      setButtonState({
        isLoading: false,
        message: "Error! Try Again",
        isDone: false,
        color: "danger"
      });
      
    } else if (mapProgress.progress === 15) {
      await delay(2000)
      setButtonState({
        isLoading: true,
        message: "Calculate.....",
        isDone: false,
        color: "primary"
      });
    } 
    else if (mapProgress.progress === 50) {
      await delay(1000)
      setButtonState({
        isLoading: true,
        message: "Hold on",
        isDone: false,
        color: "primary"
      });
    }
    else if (mapProgress.progress === 100) {
      await delay(1000)
      setButtonState({
        isLoading: false,
        message: "Done - Close Now",
        isDone: false,
        color: "secondary"
      });
    }
    else {
      await delay(1000)
      setButtonState({
        isLoading: true,
        message: mapProgress.message,
        isDone: false,
        color: "primary"
      });
    }
    }
    updateButton();
  }, [mapProgress]);

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl text-primary-500">
               Calculate Centrality
                <Progress color={'primary'} aria-label="Loading..." size="sm" value={mapProgress?.progress} />
              </ModalHeader>
              <ModalBody >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 items-start">
                      <div>
                        <Tooltip content="If there is mistake re-choose the graph type and column data">
                          <Button>Metadata</Button>
                      </Tooltip>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row gap-4">
                        <Code color="primary">{vertex1}</Code>
                        <Code color="secondary">{vertex2}</Code>
                         <Code color="primary">{graphType}</Code>
                      </div>
                      
                    </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                 color={`${buttonState.color}`}
                 onPress={calculate}
                 isLoading={buttonState.isLoading}>
                  {buttonState.message}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
