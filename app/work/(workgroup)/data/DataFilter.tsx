// DataFilter.tsx
"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import DataPicker from "./DataPicker";

export default function DataFilter() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">File</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="File actions">
        <DropdownItem key="open" textValue="Open">
          <DataPicker />
        </DropdownItem>
        <DropdownItem key="save" textValue="Save as...">
          Save As...
        </DropdownItem>
        <DropdownItem key="delete" textValue="Delete" className="text-danger">
          Delete File
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
