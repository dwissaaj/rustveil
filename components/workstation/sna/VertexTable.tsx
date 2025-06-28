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
  data: any[];
  title: string;
}

export default function VertexTable({ data, title }: VertexTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">{title}</h3>
      <Table aria-label={`${title} data`} className="border rounded-lg">
        <TableHeader>
          <TableColumn>Row</TableColumn>
          <TableColumn>Value</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((value, index) => (
            <TableRow key={`${title}-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-mono">{String(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
