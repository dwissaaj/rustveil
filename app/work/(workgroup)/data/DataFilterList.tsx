"use client";
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Alert,
} from "@heroui/react";
import { UploadIcon } from "@/components/icon/IconFilter";
import DataPicker from "./picker/DataPickerModal";
import { useState } from "react";
import DataLoader from "./picker/DataLoadModal";

export default function DataFilterList() {
  const { isOpen: isPickerOpen, onOpen: onPickerOpen, onOpenChange: onPickerOpenChange } = useDisclosure();
  const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onOpenChange: onLoaderOpenChange } = useDisclosure();
  const [fileLoaded, setFileLoaded] = useState(false);

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">File</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions">
          <DropdownItem key="pick-file" onPress={onPickerOpen}>
            <Button
              isDisabled={fileLoaded}
              endContent={<UploadIcon />}
              className="w-full justify-start"
              color="secondary"
              variant="ghost"
              onPress={onPickerOpen}
            >
              Open File
            </Button>
          </DropdownItem>
          <DropdownItem key="load-file" onPress={onLoaderOpen}>
            <Button
              isDisabled={fileLoaded}
              endContent={<UploadIcon />}
              className="w-full justify-start"
              color="secondary"
              variant="ghost"
              onPress={onLoaderOpen}
            >
              Load File
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DataPicker
        isOpen={isPickerOpen}
        onOpenChange={onPickerOpenChange}
        fileLoaded={fileLoaded}
        setFileLoaded={setFileLoaded}
      />
      <DataLoader
        isOpen={isLoaderOpen}
        onOpenChange={onLoaderOpenChange}
        fileLoaded={fileLoaded}
        setFileLoaded={setFileLoaded}
      />
    </>
  );
}