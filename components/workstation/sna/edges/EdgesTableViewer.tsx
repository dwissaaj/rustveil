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
import { useAtom, useAtomValue } from "jotai";
import { vertex1ColumnSelected, vertex2ColumnSelected } from "@/app/lib/workstation/data/state";
import NoVerticesSelected from "./NoVertices";

interface DataTableProps {
  data: Record<string, any>[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;

}

export default function VertexTableServer({
  data,
  isLoading = false,
  totalCount = 0,
  currentPage = 1,
  pageSize = 100,
  onPageChange,
  onRefresh,

}: DataTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startRow = (currentPage - 1) * pageSize + 1;
  const targetVertex1 = useAtomValue(vertex1ColumnSelected)
  const targetVertex2 = useAtomValue(vertex2ColumnSelected)
  const visibleColumns = ["Number", targetVertex1, targetVertex2];
  const hasVertices = targetVertex1 && targetVertex2; 
  if (!hasVertices) {
    return (
      <div className="flex flex-col gap-4">
        <Table aria-label="Vertex-only data table">
          <TableHeader>
            <TableColumn>Number</TableColumn>
            <TableColumn>Vertex 1</TableColumn>
            <TableColumn>Vertex 2</TableColumn>
          </TableHeader>
          <TableBody emptyContent={<NoVerticesSelected />}>{[]}</TableBody>
        </Table>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <Table
        isHeaderSticky
        isVirtualized
        isStriped
        aria-label="Vertex-only data table"
        bottomContent={
          totalCount > 0 && (
            <div className="text-sm text-default-500">
              Showing {data.length} of {totalCount} records (Page {currentPage}{" "}
              of {totalPages})
            </div>
          )
        }
        bottomContentPlacement="outside"
        topContent={
          <Button
            isIconOnly
            color="primary"
            variant="light"
            startContent={<RefreshIcon />}
            onPress={onRefresh}
          />
        }
      >
        <TableHeader>
          {visibleColumns.map((column) => (
            <TableColumn>{column}</TableColumn>
          ))}
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          loadingContent={<CircularProgress size="lg" color="secondary" />}
          emptyContent={<NoData />}
        >
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{startRow + index}</TableCell>
              <TableCell >{row[targetVertex1]}</TableCell>
              <TableCell >{row[targetVertex2]}</TableCell>
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
