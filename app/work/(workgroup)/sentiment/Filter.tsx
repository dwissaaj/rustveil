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


import { UploadNewData, LoadNewData } from "@/components/icon/IconFilter";
import { EditTabIcon } from "@/components/icon/IconAction";

export default function Filter() {
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
          startContent={<EditTabIcon className="w-4" />}
            size="sm"
            className="text-black dark:text-white"
            color="primary"
            variant="light"
          >
            Target
          </Button>
        </DropdownTrigger>
        <DropdownMenu color="primary" variant="flat" aria-label="File actions">
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
      
    </>
  );
}
