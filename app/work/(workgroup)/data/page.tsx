
"use client";


import { useState } from "react";


import FilterWrapTest from "./test/FilterWrapTest";

import { useRefreshServer } from "@/app/lib/workstation/data/handler/server/useRefreshServer";
import TableServer from "./table/TableServer";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  


  const handleDataFetched = (newData: any[], total?: number) => {
    setLoading(false);
    console.log("new data", newData);
    console.log(" data", data);
    setData(newData);
    setTotalCount(total || 0);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    await refresh(page);
  };
  const { refresh } = useRefreshServer(handleDataFetched);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterWrapTest onDataFetched={() => refresh(1)} />
      </div>
      <div>
        <TableServer 
           data = {data}
        isLoading={loading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={100}
        onPageChange={handlePageChange}
        onRefresh={() => refresh(1)}
        />
      </div>
    </div>
  );
}
// "use client";

// import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
// import DataTable from "./table/DataTable";
// import { useState } from "react";

// export default function Page() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleDataFetched = (newData: any[]) => {
//     setLoading(false);
//     setData(newData);
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div>
//         <FilterListWrapper onDataFetched={handleDataFetched} />
//       </div>
//       <div>
//         <DataTable
//           data={data}
//           isLoading={loading}
//           onDataFetched={handleDataFetched}
//         />
//       </div>
//     </div>
//   );
// }
