
"use client";

import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
import DataTable from "./table/DataTable";
import { useState } from "react";
import { Button } from "@heroui/button";
import { useRefTest } from "./test/useRefTest";
import FilterWrapTest from "./test/FilterWrapTest";
import DataTes from "./test/DataTest";

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
  const { refresh } = useRefTest(handleDataFetched);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterWrapTest onDataFetched={() => refresh(1)} />
      </div>
      <div>
        <DataTes 
          data={data} 
          isLoading={loading}
          totalCount={totalCount}
          currentPage={currentPage}
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
