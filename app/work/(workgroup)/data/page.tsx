"use client";
import { useAtom } from "jotai";
import DataTable from "./table/DataTable";
import NoData from "@/components/workstation/data/NoData";
import FilterList from "@/components/workstation/data/FilterListWrapper";
import { useState } from "react";
export default function Page() {

const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  const handleRefresh = (newData: Record<string, any>[]) => {
    setTableData(newData);
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterList onRefresh={handleRefresh} />
      </div>
      <div>
        <DataTable data={tableData} />
        
      </div>
    </div>
  );
}
