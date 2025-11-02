"use client";
import { useAtom } from "jotai";

import TableServer from "./table/TableServer";

import { useRefreshServer } from "@/app/lib/data/handler/server/useRefreshServer";
import FilterListWrapper from "@/components/data/FilterListWrapper";
import {
  currentPageTable,
  dataTable,
  loadingTable,
  totalCountTable,
} from "@/app/lib/data/state";

export default function Page() {
  const [data, setData] = useAtom(dataTable);
  const [loading, setLoading] = useAtom(loadingTable);
  const [totalCount, setTotalCount] = useAtom(totalCountTable);
  const [currentPage, setCurrentPage] = useAtom(currentPageTable);

  const { refresh } = useRefreshServer((newData, total) => {
    setData(newData);
    setTotalCount(total || 0);
    setLoading(false);
  });

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    await refresh(page);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FilterListWrapper onDataFetched={() => refresh(1)} />
      </div>
      <div>
        <TableServer
          currentPage={currentPage}
          data={data}
          isLoading={loading}
          pageSize={100}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onRefresh={() => refresh(1)}
        />
      </div>
    </div>
  );
}
