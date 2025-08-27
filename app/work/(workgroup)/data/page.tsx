import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
import DataTable from "./table/DataTable";
import DataFileDropdown from "./dropdown/DataFileDropdown";
import { ViewDropdown } from "./dropdown/ViewDropdown";
import {  useState } from "react";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDataFetched = (newData: any[]) => {
    setLoading(false); 
    setData(newData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 border-b py-2 items-center">
        <DataFileDropdown />
        <ViewDropdown onDataFetched={handleDataFetched} />
      </div>
      <div>
         <DataTable 
        data={data} 
        isLoading={loading} 
        onDataFetched={handleDataFetched} 
      />
      </div>
    </div>
  );
}
