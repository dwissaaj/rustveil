"use client";

import DataFileDropdown from "@/app/work/(workgroup)/data/dropdown/DataFileDropdown";
import { ViewDropdown } from "@/app/work/(workgroup)/data/dropdown/ViewDropdown";
import { ViewTest } from "./ViewTest";

interface FilterWrapTestProps {
  onDataFetched?: (data: any[], totalCount?: number) => void; // 👈 ADD TOTAL COUNT PARAM
}

export default function FilterWrapTest({ onDataFetched }: FilterWrapTestProps) {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <DataFileDropdown />
      </div>
      <div>
        <ViewTest onDataFetched={onDataFetched} />
      </div>
    </div>
  );
}