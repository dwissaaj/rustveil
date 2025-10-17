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
} from "../../../lib/sentiment_analysis/state";
import {
  ModelAiOutline,
  ColumnFilterOutline,
  LanguageIcon,
} from "@/components/icon/IconSA";

export default function ListLang() {
  const [selectedLanguage, setselectedLanguage] = useAtom(selectedLang);
  console.log(selectedLang);
  const selectedModel = modelMap[selectedLanguage] || modelMap.default;
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ModelComponent =
    modelComponents[selectedModel] || modelComponents.default;

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div>
        <Select
          label="Target Language"
          placeholder="Select a Language"
          variant="underlined"
          color="primary"
          labelPlacement="inside"
          selectedKeys={[selectedLanguage]}
          onChange={(e) => setselectedLanguage(e.target.value)}
        >
          {supportedLang.map((lang) => (
            <SelectItem key={lang.key}>{lang.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex gap-2">
        <Tooltip
          className="capitalize"
          color="secondary"
          content="Mismatched at choose language result in bad sentiment"
        >
          <Chip
            startContent={<LanguageIcon className="size-6 " />}
            color="secondary"
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
            startContent={<ColumnFilterOutline className="size-6 " />}
            color="secondary"
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
            startContent={<ModelAiOutline className="size-6 " />}
            className="cursor-pointer"
            color="secondary"
            variant="flat"
            onClick={onOpen}
          >
            {selectedModel}
          </Chip>
        </Tooltip>
      </div>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
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
