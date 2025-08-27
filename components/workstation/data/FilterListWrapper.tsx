
"use client";
import DataExport from "@/app/work/(workgroup)/data/picker/DataExport";
import DataFileDropdown from "@/app/work/(workgroup)/data/dropdown/DataFileDropdown";

import { addToast, Button, Toast } from "@heroui/react";
import ViewDropdown from "@/app/work/(workgroup)/data/dropdown/ViewDropdown";
interface FilterListWrapperProps {
  onRefresh: (data: Record<string, any>[]) => void;
}

export default function FilterListWrapper({ onRefresh }: FilterListWrapperProps) {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <DataFileDropdown />
      </div>
      <div>
        <ViewDropdown onRefresh={onRefresh}  />
        </div>
    </div>
  );
}
