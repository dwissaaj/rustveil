"use client";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

/**
 * Displays vertex data in a structured table format
 *
 * @component
 * @example
 * <VertexTable />
 *
 * @description
 * Renders a two-column table showing selected vertex data from useGraphData hook.
 * Automatically handles mismatched array lengths and null values.
 *
 * @hooks
 * - useGraphData: Provides vertex selections and their data arrays
 *
 * @ui
 * - Hero UI Table component with border rounding
 * - Monospace font for values
 * - Dynamic column headers
 * - "N/A" for missing values
 *
 * @behavior
 * - Shows row numbers (1-indexed)
 * - Displays "Column 1/2" when no header selected
 * - Syncs with vertex selections in real-time
 */

export default function EdgesTable() {
  const { vertex1, vertex2, vertex1Data, vertex2Data } = useGraphData();

  const rowCount = Math.max(vertex1Data.length, vertex2Data.length);

  return (
    <Table isVirtualized aria-label="Vertex Data" className="border rounded-lg">
      <TableHeader>
        <TableColumn>ROW</TableColumn>
        <TableColumn>{vertex1 || "Column 1"}</TableColumn>
        <TableColumn>{vertex2 || "Column 2"}</TableColumn>
      </TableHeader>
      <TableBody>
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
