// components/DataFilter.tsx
"use client";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DatePicker } from "@heroui/react";
import { UploadIcon } from "@/components/icon/IconFilter";
import DataPicker from "./DataPicker";


export default function DataFilterList() {

  return (
    <>
      <Dropdown  closeOnSelect={false} >
        <DropdownTrigger>
          <Button variant="bordered">File</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions">
          <DropdownItem 
            key="open"      
            >
            <DataPicker />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    
    </>
  );
}