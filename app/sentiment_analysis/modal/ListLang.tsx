"use client";

import React, { useState } from "react";
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

import { modelComponents, modelMap, supportedLang } from "./supportedLang";
import { columnTargetSentimentAnalysis, selectedLang } from "../state";
import { ModelAiOutline } from "@/components/icon/IconView";
import { ColumnFilterOutline, ColumnFilterSolid } from "@/components/icon/IconFilter";



export default function ListLang() {
  const [selectedLanguage, setselectedLanguage] = useAtom(selectedLang)

  const selectedModel = modelMap[selectedLanguage] || modelMap.default;
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ModelComponent =
    modelComponents[selectedModel] || modelComponents.default;

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div className="flex gap-2">
        <Tooltip
          className="capitalize"
          color="primary"
          content="If You want to change target go to Setting > Pick Column Target"
        >
          <Chip startContent={<ColumnFilterOutline className="w-1 "  />} color="primary" variant="flat">
            {columnTarget}
          </Chip>
        </Tooltip>
        <Tooltip
          className="capitalize"
          color="primary"
          content="This is the model currently used for sentiment analysis"
        >
          <Chip startContent={<ModelAiOutline className="w-1 "  />} className="cursor-pointer" color="primary" variant="flat" onClick={onOpen}>
            {selectedModel}
          </Chip>
        </Tooltip>
      </div>

      <div>
        <Select
          label="Favorite Lang"
          placeholder="Select a Language"
          selectedKeys={[selectedLanguage]}
          onChange={(e) => setselectedLanguage(e.target.value)}
        >
          {supportedLang.map((lang) => (
            <SelectItem key={lang.key}>{lang.label}</SelectItem>
          ))}
        </Select>
      </div>


      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="text-2xl">Model Information</DrawerHeader>
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
