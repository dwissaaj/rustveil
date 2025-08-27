import React from "react";
import NoData from "@/components/workstation/data/NoData";
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
import { RefreshIcon } from "@/components/icon/IconView";
import { useRefresh } from "@/app/lib/workstation/data/handler/useRefresh";

interface DataTableProps {
  data: Record<string, any>[];
  isLoading?: boolean;
  rowsPerPage?: number;
  onDataFetched?: (data: any[]) => void; // 👈 add this
}

export default function DataTable({ data, isLoading = false, rowsPerPage = 100, onDataFetched }: DataTableProps) {
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
      topContent={
      <Button 
        isIconOnly
        color="primary" 
        variant="light" 
        startContent={<RefreshIcon  />} 
        onPress={refresh}
      >
      </Button>
  }
      isHeaderSticky isVirtualized isStriped aria-label="Dynamic data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<CircularProgress size="lg" color="secondary" />}
          emptyContent={<NoData />}
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
            total={totalPages}
            page={page}
            onChange={setPage}
            color="secondary"
            showControls
          />
        </div>
      )}
    </div>
  );
}
