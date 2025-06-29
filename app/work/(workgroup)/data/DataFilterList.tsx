// components/DataFilter.tsx
"use client";
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { UploadIcon } from "@/components/icon/IconFilter";
import DataPicker from "./picker/DataPickerModal";
import { useState } from "react";

export default function DataFilterList() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [fileLoaded, setFileLoaded] = useState(false);
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">File</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions">
          <DropdownItem key="open" onPress={onOpen}>
            <Button
              isDisabled={fileLoaded}
              endContent={<UploadIcon />}
              className="w-full justify-start"
              color="secondary"
              variant="ghost"
              onPress={onOpen}
            >
              Open File
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DataPicker
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        fileLoaded={fileLoaded}
        setFileLoaded={setFileLoaded}
      />
    </>
  );
}
