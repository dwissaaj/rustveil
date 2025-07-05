"use client";
import {  vertex1ColumnSelected, vertex2ColumnSelected } from "@/app/lib/workstation/data/state";
import { ProcessingResult, ProcessingStatus, useMapId } from "@/app/lib/workstation/social/useMapId";
import { MappingProgress, useMapProgress } from "@/app/lib/workstation/social/useMapProgress";
import { useVerticesData } from "@/app/lib/workstation/social/useVerticesData";
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

  const{ vertex1,vertex2, graphType } = useVerticesData()
  const useCalculate = useMapId()
  const mapProgress = useMapProgress()
  const [currentProgress, setCurrentProgress] = useState<MappingProgress>();
  const [progress, setProgress] = useState<"primary" | "danger">("primary");
  const [buttonState, usebuttonState] = useState(false)
  const calculate = async () => {
    try {
      setProgress("primary")
      usebuttonState(true)
      const result = await useCalculate();
      console.log(result)
    } catch (error) {
      setProgress("danger")
      console.log(error)
    } finally {
      usebuttonState(false)
    }
  };
  useEffect(() => {
        if (mapProgress) {
            setCurrentProgress(mapProgress);
        }
    }, [mapProgress]);

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl text-primary-500">
               Calculate Centrality
                <Progress color={`${progress}`} aria-label="Loading..." size="sm" value={currentProgress?.progress} />
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
                 color="primary" 
                 onPress={calculate}
                 isLoading={buttonState}>
                  Calculate
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
