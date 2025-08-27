import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
import DataTable from "./table/DataTable";
import DataFileDropdown from "./dropdown/DataFileDropdown";
import { ViewDropdown } from "./dropdown/ViewDropdown";
import { useRef, useState } from "react";

export default function Page() {
  const dataRef = useRef<any[]>([]);
  const [, forceUpdate] = useState(0); // just used to trigger re-render

  const handleDataFetched = (data: any[]) => {
    dataRef.current = data;           // ✅ put data in ref (not React state)
    forceUpdate((n) => n + 1);        // ✅ trigger re-render so DataTable sees new data
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 border-b py-2 items-center">
        <DataFileDropdown />
        <ViewDropdown onDataFetched={handleDataFetched} />
      </div>
      <div>
        {/* ✅ DataTable untouched — still gets `data` prop */}
        <DataTable data={dataRef.current} isLoading={false} />
      </div>
    </div>
  );
}
