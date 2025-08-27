import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
import DataTable from "./table/DataTable";
import { useState } from "react";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDataFetched = (newData: any[]) => {
    setLoading(false);
    setData(newData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterListWrapper onDataFetched={handleDataFetched} />
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
