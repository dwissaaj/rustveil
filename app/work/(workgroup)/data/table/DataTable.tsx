import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Pagination,
  Button,
} from "@heroui/react";

import NoData from "@/components/workstation/data/NoData";
import { RefreshIcon } from "@/components/icon/IconView";
import { useRefresh } from "@/app/lib/workstation/data/handler/client/useRefresh";

interface DataTableProps {
  data: Record<string, any>[];
  isLoading?: boolean;
  rowsPerPage?: number;
  onDataFetched?: (data: any[]) => void; // 👈 add this
}

export default function DataTable({
  data,
  isLoading = false,
  rowsPerPage = 100,
  onDataFetched,
}: DataTableProps) {
  const [page, setPage] = React.useState(1);

  // calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // slice the data based on page
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data, rowsPerPage]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const { refresh } = useRefresh(onDataFetched);

  return (
    <div className="flex flex-col gap-4">
      <Table
        isHeaderSticky
        isStriped
        isVirtualized
        aria-label="Dynamic data table"
        topContent={
          <Button
            isIconOnly
            className="m-2"
            color="primary"
            startContent={<RefreshIcon />}
            variant="light"
            onPress={refresh}
          />
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={<NoData />}
          isLoading={isLoading}
          loadingContent={<CircularProgress color="secondary" size="lg" />}
        >
          {paginatedData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={`${index}-${column}`}>
                  {row[column]?.toString() || ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            showControls
            color="secondary"
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
