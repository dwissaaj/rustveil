import NoData from "@/components/workstation/data/NoData";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, CircularProgress } from "@heroui/react";

interface DataTableProps {
  data: Record<string, any>[];
  isLoading?: boolean;
}

export default function DataTable({ data, isLoading = false }: DataTableProps) {
  // Get column names from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Table isVirtualized isStriped aria-label="Dynamic data table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody isLoading={isLoading} loadingContent={<CircularProgress />} emptyContent={<NoData />} >
        {data.map((row, index) => (
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
  );
}