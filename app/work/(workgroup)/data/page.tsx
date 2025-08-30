"use client";
import { useRefreshServer } from "@/app/lib/workstation/data/handler/server/useRefreshServer";
import TableServer from "./table/TableServer";
import FilterListWrapper from "@/components/workstation/data/FilterListWrapper";
import { useAtom } from "jotai";
import {
  currentPageTable,
  dataTable,
  loadingTable,
  totalCountTable,
} from "@/app/lib/workstation/data/state";
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
          data={data}
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
