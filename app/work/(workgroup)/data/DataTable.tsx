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

type DataTableProps = {
  data: TableDataType;
};

export default function DataTable({ data }: DataTableProps) {
    
  return (
    <Table isStriped aria-label="Dynamic Table">
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
