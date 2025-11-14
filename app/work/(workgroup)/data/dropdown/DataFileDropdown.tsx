"use client";
import { useState } from "react";
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import DataPicker from "../picker/DataPickerModal";
import DataLoader from "../picker/DataLoadModal";

import { UploadNewData, LoadNewData } from "@/components/icon/IconFilter";

export default function DataFileDropdown() {
  const {
    isOpen: isPickerOpen,
    onOpen: onPickerOpen,
    onOpenChange: onPickerOpenChange,
  } = useDisclosure();
  const {
    isOpen: isLoaderOpen,
    onOpen: onLoaderOpen,
    onOpenChange: onLoaderOpenChange,
  } = useDisclosure();
  const [fileLoaded, setFileLoaded] = useState(false);

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="text-black dark:text-white"
            color="primary"
            size="lg"
            variant="light"
          >
            File
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions" color="primary" variant="flat">
          <DropdownItem
            key="pick-file"
            description="Start with new data"
            startContent={<UploadNewData className="w-6" />}
            onPress={onPickerOpen}
          >
            Open File
          </DropdownItem>
          <DropdownItem
            key="load-file"
            description="Load existed sqlite file"
            startContent={<LoadNewData className="w-6" />}
            onPress={onLoaderOpen}
          >
            Load File
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DataPicker
        fileLoaded={fileLoaded}
        isOpen={isPickerOpen}
        setFileLoaded={setFileLoaded}
        onOpenChange={onPickerOpenChange}
      />
      <DataLoader
        fileLoaded={fileLoaded}
        isOpen={isLoaderOpen}
        setFileLoaded={setFileLoaded}
        onOpenChange={onLoaderOpenChange}
      />
    </>
  );
}
