"use client";

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
import {  useState } from "react";
import { useAtomValue } from "jotai";
import { vertex1ColumnSelected, vertex2ColumnSelected, vertexGraphTypeSelected } from "@/app/lib/workstation/data/state";
import { InfoIcon } from "@/components/icon/IconFilter";
import { CloseActionIcon } from "@/components/icon/IconAction";
import { useCalculateCentrality } from "@/app/lib/workstation/social/calculate/useCalculateCentrality";
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
  const [isProgess, setisProgess] = useState<{
    isLoading: boolean;
    isShowed: boolean;
    isButtonDisabled?: boolean;
  }>({
    isLoading: false,
    isShowed: false,
    isButtonDisabled: false,
  });


  const calculate = useCalculateCentrality()
const handleCalculate = async () => {

  setisProgess({
    isLoading: true,
    isShowed: true,
    isButtonDisabled: true,
  });
  
 
  setTimeout(async () => {
    try {
      const result = await calculate();

      
      if (result?.response_code === 200) {
        addToast({
          title: "Operation Success",
          description: `${result?.message}`,
          color: "success",
        });
      } else {
        addToast({
          title: "Operation Error",
          description: `${result?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Operation Error",
        description: `Error at Modal Function: ${error}`,
        color: "danger",
      });
        setisProgess({
          isLoading: true,
          isShowed: true,
          isButtonDisabled: true,
        });
    } finally {
        setisProgess({
          isLoading: false,
          isShowed: false,
          isButtonDisabled: false,
        });
    }
  }, 1000); // Small delay to ensure UI updates
  };  

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}
        closeButton={<Button variant="light" color="warning" isIconOnly startContent={<CloseActionIcon className="w-6 h-6 "/>} >

        </Button>}
      >
        <ModalContent>
              <ModalHeader className="flex flex-col gap-1 text-4xl text-primary-500">
                Calculate Centrality
                 {isProgess.isShowed && (
                  <Progress
                    className="w-full"
                    isIndeterminate={isProgess.isLoading}
                    color="primary"
                    size="sm"
                    label={
                     <p className="text-lg ">Larger data have longer process</p>
                    }
                  />
                )}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 items-start justify-start">
                  <div className="flex flex-col gap-2 items-start">
                    <div>
                      <Tooltip content="If there is mistake re-choose the graph type and column data">
                        <Button className="text-lg" variant="light"  startContent={<InfoIcon />}>Information</Button>
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
                isDisabled={isProgess.isButtonDisabled}
                >
                Calculate
                </Button>
                
              </ModalFooter>
            
          
        </ModalContent>
      </Modal>
    </>
  );
}
