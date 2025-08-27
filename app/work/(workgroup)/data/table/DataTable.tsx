import NoData from "@/components/workstation/data/NoData";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

interface DataTableProps {
  data?: Record<string, any>[]; // Make data optional
}

export default function DataTable({ data = [] }: DataTableProps) { 
 
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Table isStriped isVirtualized aria-label="Data table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={<NoData />}>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column}>
                {row[column]} 
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}