"use client";

import { useAtom } from "jotai";
import DataTable from "./table/DataTable";
import NoData from "@/components/workstation/data/NoData";
import { tableData } from "@/app/lib/workstation/data/state";
import DataPicker from "./picker/DataPicker";
import DataFilter from "./picker/DataFilterFile";
import FilterList from "@/components/workstation/data/FilterListWrapper";

export default function Page() {
  const [data] = useAtom(tableData);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterList />
      </div>
      <div>
        <div>{data ? <DataTable data={data} /> : <NoData />}</div>
      </div>
    </div>
  );
}
