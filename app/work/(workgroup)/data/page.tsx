"use client";

import { useAtom } from "jotai";
import DataTable from "./DataTable";
import NoData from "@/components/workstation/data/NoData";
import { tableData } from "@/app/lib/workstation/data/state";
import DataPicker from "./DataPicker";
import DataFilter from "./DataFilter";

export default function Page() {
  const [data] = useAtom(tableData);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <DataPicker />
      </div>
      <div>
        <div>{data ? <DataTable data={data} /> : <NoData />}</div>
      </div>
    </div>
  );
}
