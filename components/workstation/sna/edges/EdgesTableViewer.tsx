"use client";
import { TableCell as TableCellType } from "@/app/lib/workstation/data/dto";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
interface TableViewerProps {
  vertex1: string;
  vertex2: string;
  vertex1Data: TableCellType[];
  vertex2Data: TableCellType[];
}
export default function EdgesTableViewer({
  vertex1,
  vertex2,
  vertex1Data,
  vertex2Data,
}: TableViewerProps) {
  const rowCount = Math.max(vertex1Data.length, vertex2Data.length);

  return (
    <Table isVirtualized aria-label="Vertex Data" className="border rounded-lg">
      <TableHeader>
        <TableColumn>ROW</TableColumn>
        <TableColumn>{vertex1 || "Column 1"}</TableColumn>
        <TableColumn>{vertex2 || "Column 2"}</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No Edges available"}>
        {Array.from({ length: rowCount }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="font-mono">
              {vertex1Data[index] !== undefined
                ? String(vertex1Data[index])
                : "N/A"}
            </TableCell>
            <TableCell className="font-mono">
              {vertex2Data[index] !== undefined
                ? String(vertex2Data[index])
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
