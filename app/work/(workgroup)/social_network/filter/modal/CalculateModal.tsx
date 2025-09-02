"use client";
import { useMapId } from "@/app/lib/workstation/social/useMapId";
import { useMapProgress } from "@/app/lib/workstation/social/useMapProgress";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Code,
  Tooltip,
  Progress,
  addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { dataTable, vertex1ColumnSelected, vertex2ColumnSelected, vertexGraphTypeSelected } from "@/app/lib/workstation/data/state";
import { InfoIcon } from "@/components/icon/IconFilter";
import { CloseActionIcon } from "@/components/icon/IconAction";
import { useCalcCentrality } from "@/app/lib/workstation/social/calculate/useCalcCentrality";
import { CalculateIcon } from "@/components/icon/IconGraph";

type CalculateModal = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function SocialCalculateModal({
  isOpen,
  onOpenChange,
}: CalculateModal) {
  const vertex1 = useAtomValue(vertex1ColumnSelected)
  const vertex2 = useAtomValue(vertex2ColumnSelected)
  const graphType = useAtomValue(vertexGraphTypeSelected)


  // const { vertex1, vertex2, graphType } = useGraphData();
  // const useCalculate = useMapId();
  // const mapProgress = useMapProgress();
  // const [buttonState, setButtonState] = useState<{
  //   isLoading: boolean;
  //   message: string;
  //   isDone: boolean;
  //   color: "primary" | "danger" | "secondary";
  //   isDisabled: boolean;
  // }>({
  //   isLoading: false,
  //   message: "Calculate",
  //   isDone: false,
  //   color: "primary",
  //   isDisabled: false,
  // });
  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // const calculate = async () => {
  //   try {
  //     setButtonState({
  //       isLoading: true,
  //       message: "Initializing...",
  //       isDone: false,
  //       color: "primary",
  //       isDisabled: true,
  //     });
  //     await delay(1000);
  //     await useCalculate();
  //     await delay(1000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const calculate = useCalcCentrality()
  const handleCalculate = async () => {
    try {
      const result = await calculate()
      console.log(result)
      if (result?.response_code === 200) {
        addToast({
          title: "Operation Success",
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
      }
    } catch (error) {
      addToast({
          title: "Operation Error",
          description: `Error at Modal Function${error}`,
          color: "danger",
        });
    }
  }

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
         

              <ModalHeader className="flex flex-col gap-1 text-4xl text-primary-500">
                Calculate Centrality
                <Progress
                  color={"primary"}
                  aria-label="Loading..."
                  size="sm"
                  
                />
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 items-start">
                    <div>
                      <Tooltip content="If there is mistake re-choose the graph type and column data">
                        <Button variant="light"  startContent={<InfoIcon />}>Information</Button>
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
              <ModalFooter className="w-full">

                <Button
                color="primary"
                startContent={<CalculateIcon />}
                className="w-full"
                onPress={handleCalculate}
                >
                Calculate
                </Button>
                
              </ModalFooter>
            
          
        </ModalContent>
      </Modal>
    </>
  );
}
