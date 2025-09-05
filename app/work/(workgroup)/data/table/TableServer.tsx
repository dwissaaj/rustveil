import React, { useEffect } from "react";
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
import { useAtom } from "jotai";
import { columnAvailable } from "@/app/lib/workstation/data/state";
interface DataTableProps {
  data: Record<string, any>[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function TableServer({
  data,
  isLoading = false,
  totalCount = 0,
  currentPage = 1,
  pageSize = 100,
  onPageChange,
  onRefresh,
}: DataTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const startRow = (currentPage - 1) * pageSize + 1;

  const allColumns = ["Number", ...columns];
  const [ ,setColumnAvailable] = useAtom(columnAvailable);
   useEffect(() => {
    // only update the atom if allColumns actually changed
    setColumnAvailable(allColumns);
  }, [allColumns.join(","), setColumnAvailable]);
  return (
    <div className="flex flex-col gap-4">
      <Table
        isHeaderSticky
        isVirtualized
        isStriped
        aria-label="Dynamic data table"
        bottomContent={
          totalCount > 0 && (
            <div className="text-sm">
              Showing {data.length} of {totalCount} records (Page {currentPage}{" "}
              of {totalPages})
            </div>
          )
        }
        bottomContentPlacement="outside"
        topContent={
          <Button
           className="m-2"
            isIconOnly
            color="primary"
            variant="light"
            startContent={<RefreshIcon />}
            onPress={onRefresh}
          ></Button>
        }
      >
        <TableHeader>
          {allColumns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<CircularProgress size="lg" color="secondary" />}
          emptyContent={<NoData />}
        >
          {data.map((row, index) => (
            <TableRow key={index}>
              {[
                <TableCell key="row-number">{startRow + index}</TableCell>,
                ...columns.map((column) => (
                  <TableCell key={`${index}-${column}`}>
                    {String(row[column] || "")}
                  </TableCell>
                )),
              ]}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="secondary"
            showControls
          />
        </div>
      )}
    </div>
  );
}
