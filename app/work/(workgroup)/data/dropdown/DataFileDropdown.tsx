"use client";
import { useState } from "react";
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Alert,
} from "@heroui/react";
import {  UploadNewData, LoadNewData } from "@/components/icon/IconFilter";
import DataPicker from "../picker/DataPickerModal";
import DataLoader from "../picker/DataLoadModal";

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
          <Button variant="light">File</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions">
          <DropdownItem description="Start with new data" startContent={<UploadNewData />} key="pick-file" onPress={onPickerOpen}>
              Open File
          </DropdownItem>
          <DropdownItem description="Load existed sqlite file" startContent={<LoadNewData />} key="load-file" onPress={onLoaderOpen}>
              Load File
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
