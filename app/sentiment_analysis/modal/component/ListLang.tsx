"use client";

import {
  Select,
  SelectItem,
  Chip,
  Tooltip,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
  DrawerFooter,
} from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";

import {
  modelComponents,
  modelMap,
  supportedLang,
} from "../../../lib/sentiment_analysis/supportedLang";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
  targetSentimentCreatedAt,
} from "../../../lib/sentiment_analysis/state";

import {
  ModelAiOutline,
  ColumnFilterOutline,
  LanguageIcon,
} from "@/components/icon/IconSA";

export default function ListLang() {
  const [selectedLanguage, setselectedLanguage] = useAtom(selectedLang);

  const selectedModel = modelMap[selectedLanguage] || modelMap.default;
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);
  const createdAt = useAtomValue(targetSentimentCreatedAt)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ModelComponent =
    modelComponents[selectedModel] || modelComponents.default;

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div>
        <Select
        className="max-w-2xl"
          color="primary"
          label="Target Language"
          labelPlacement="inside"
          placeholder="Select a Language"
          selectedKeys={[selectedLanguage]}
          variant="underlined"
          onChange={(e) => setselectedLanguage(e.target.value)}
        >
          {supportedLang.map((lang) => (
            <SelectItem key={lang.key}>{lang.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="max-w-full flex flex-row gap-2 ">
        <Tooltip
          className="capitalize"
          color="secondary"
          content="Mismatched at choose language result in bad sentiment"
        >
          <Chip
            color="secondary"
            startContent={<LanguageIcon className="size-6 " />}
            variant="flat"
          >
            {selectedLanguage}
          </Chip>
        </Tooltip>
        <Tooltip
          className="capitalize"
          color="secondary"
          content="If No column showed upload a data first"
        >
          <Chip
            color="secondary"
            startContent={<ColumnFilterOutline className="size-6 " />}
            variant="flat"
          >
            {columnTarget}
          </Chip>
        </Tooltip>
        <Tooltip
          className="capitalize"
          color="secondary"
          content="This is the model currently used for sentiment analysis"
        >
          <Chip
            className="cursor-pointer"
            color="secondary"
            startContent={<ModelAiOutline className="size-6 " />}
            variant="flat"
            onClick={onOpen}
          >
            {selectedModel}
          </Chip>
          
        </Tooltip>
        <Tooltip
          className="capitalize"
          color="secondary"
          content="Timestamp when select the column"
        >
          <Chip
            className="cursor-pointer"
            color="secondary"
            startContent={<ModelAiOutline className="size-6 " />}
            variant="flat"
            onClick={onOpen}
          >
            {createdAt.slice(0,10)}
          </Chip>
          
        </Tooltip>
      </div>

      <Drawer isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="text-2xl">
                Model Information
              </DrawerHeader>
              <DrawerBody>
                <ModelComponent />
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
