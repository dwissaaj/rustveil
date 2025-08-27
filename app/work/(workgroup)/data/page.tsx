import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
import DataTable from "./table/DataTable";
import { useState } from "react";
export default function Page() {

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterListWrapper  />
      </div>
      <div>
        {/* <DataTable data={testData} isLoading={isLoading} /> */}
      </div>
    </div>
  );
}