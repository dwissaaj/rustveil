import { TableDataType } from "@/app/lib/workstation/data/dto";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
} from "@heroui/react";
import React from "react";

/**
 * Displays tabular data from Excel files in a styled table format
 *
 * @component
 * @param {Object} props - Component props
 * @param {TableDataType} props.data - The table data to display
 *
 * @example
 * // Basic usage with sample data
 * const sampleData = {
 *   headers: ['Name', 'Age'],
 *   rows: [{ Name: 'Alice', Age: 30 }, { Name: 'Bob', Age: 25 }]
 * };
 *
 * <DataTable data={sampleData} />
 *
 * @description
 * Features:
 * - Automatically renders headers in uppercase
 * - Converts all cell values to strings
 * - Uses Hero UI's striped table styling
 * - Handles dynamic column counts
 *
 * @ui
 * - Striped rows for better readability
 * - Responsive design
 * - Accessible (ARIA-labeled)
 */
type DataTableProps = {
  data: TableDataType;
};

export default function DataTable({ data }: DataTableProps) {
  return (
    <Table isVirtualized isStriped aria-label="Dynamic Table">
      <TableHeader>
        {data.headers.map((header) => (
          <TableColumn key={header}>{header.toUpperCase()}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.rows.map((row, i) => (
          <TableRow key={i}>
            {data.headers.map((header) => (
              <TableCell key={header}>{String(row[header])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
