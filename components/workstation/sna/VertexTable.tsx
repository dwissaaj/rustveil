// components/VertexTable.tsx
"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

interface VertexTableProps {
  columnName: string[];       // Column name (e.g. "sentiment_label")
  values: any[];        // Array of values for the column
  className?: string;   // Optional className
}

export default function VertexTable({ columnName, values, className }: VertexTableProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
<Table>
  <TableHeader columns={columnName}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
</Table>
    </div>
  );
}