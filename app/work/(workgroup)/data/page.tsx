"use client";

import { tableDataAtom } from "@/app/lib/workstation/data/dto";
import { useAtom } from "jotai";
import DataFilter from "../../../../components/workstation/DataFilter";
import DataTable from "./DataTable";
import NoData from "@/components/workstation/NoData";


export default function Page() {
  const [data] = useAtom(tableDataAtom);

  

  return (
   <div>
     <div>
     {data ? (
        <DataTable data={data} />
      ) : (
       <NoData />
      )}
     </div>
   </div>
  );
}
