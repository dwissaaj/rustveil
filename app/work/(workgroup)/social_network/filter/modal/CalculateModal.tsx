"use client";
import { graphTypeAvailable, vertex1ColumnSelected, vertex2ColumnSelected } from "@/app/lib/workstation/data/state";
import { ProcessingResult, ProcessingStatus, useMapId } from "@/app/lib/workstation/social/useMapId";
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

type CalculateModal = {
  isOpen: boolean;
  onOpenChange: () => void;
};
export default function SocialCalculateModal({
  isOpen,
  onOpenChange,
}: CalculateModal) {
  const getData = useMapId()
  const [graphType, setgraphType] = useAtom(graphTypeAvailable);
  const vertex1Column = useAtomValue(vertex1ColumnSelected);
  const vertex2Column = useAtomValue(vertex2ColumnSelected);
  const handlemap = useMapId()
  const closeModal = async () => {
    try {
      const response: ProcessingStatus = await useMapId();
      if(response.)
      
    
    } catch (error) {
      console.log(error)
    }
    console.log(graphType)
    // onOpenChange();
  };
  const calc = async () => {
    try {
      const data = await handlemap()
      console.log(data)
    } catch (error) {
      console.log(error)
    } 
  };
  const getGraphValue = (value: string) => {
    console.log(graphType)
    setgraphType(value)
  }

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl text-primary-500">
               Calculate Centrality
                <Progress color={'primary'} aria-label="Loading..." size="sm" value={30} />
              </ModalHeader>
              <ModalBody >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 items-start">
                      <div>
                        <Tooltip content="Read more for the different">
                          <Button>Graph Type Connection</Button>
                      </Tooltip>
                      </div>
                      <div>
                        <RadioGroup 
                       value={graphType}
                      onValueChange={getGraphValue} 
                         size="md" orientation="horizontal">
                        <Radio value="direct">Direct</Radio>
                        <Radio value="undirect">Undirect</Radio>
                      </RadioGroup>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <Tooltip content="If you didn't see this try to upload a data">
                          <Button>Selected Column</Button>
                      </Tooltip>
                      </div>
                      <div className="flex flex-row gap-4">
                        <Code color="primary">{vertex1Column}</Code>
                        <Code color="secondary">{vertex2Column}</Code>
                      </div>
                      <div>
                        <Button onPress={calc}>click</Button>
                      </div>
                    </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={closeModal}>
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
