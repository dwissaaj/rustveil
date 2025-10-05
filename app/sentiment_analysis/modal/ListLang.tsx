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
} from "@heroui/react";
import { useAtomValue } from "jotai";
import { columnTargetSentimentAnalysis } from "@/app/lib/data/state";
import { modelComponents, modelMap, supportedLang } from "./supportedLang";



export default function ListLang() {
  const [selectedLang, setSelectedLang] = useState("en");

  const selectedModel = modelMap[selectedLang] || modelMap.default;
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
          <Chip color="primary" variant="dot">
            {columnTarget}
          </Chip>
        </Tooltip>
        <Tooltip
          className="capitalize"
          color="primary"
          content="This is the model currently used for sentiment analysis"
        >
          <Chip color="primary" variant="dot" onClick={onOpen}>
            {selectedModel}
          </Chip>
        </Tooltip>
      </div>

      <div>
        <Select
          label="Favorite Lang"
          placeholder="Select a Language"
          selectedKeys={[selectedLang]}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          {supportedLang.map((lang) => (
            <SelectItem key={lang.key}>{lang.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Drawer for model explanation */}
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader>{selectedModel}</DrawerHeader>
              <DrawerBody>
                <ModelComponent />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
