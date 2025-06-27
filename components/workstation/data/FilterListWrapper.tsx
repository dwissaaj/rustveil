// DataFilter.tsx
"use client";
import DataExport from "@/app/work/(workgroup)/data/DataExport";
import DataFilter from "@/app/work/(workgroup)/data/picker/DataFilterList";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";


export default function FilterListWrapper() {
  return (
   <div className="flex flex-row gap-4 border-b p-2 m-2 items-center">
      <div>
        <DataFilter />
      </div>
      <div>
        <DataExport />
      </div>
   </div>
  );
}
