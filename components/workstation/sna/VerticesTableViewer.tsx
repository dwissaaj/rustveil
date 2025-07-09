import { useGraphData } from '@/app/lib/workstation/social/useGraphData';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

export function VerticesTableViewer() {
  const { nodeMapValue, centralityValue } = useGraphData();

  return (
    <Table aria-label="Centrality Results" isStriped isVirtualized>
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>Username</TableColumn>
        <TableColumn>Centrality</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No Vertices to show"}>
        {Object?.entries(nodeMapValue || {}).map(([id, username]) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
            <TableCell>{username}</TableCell>
            <TableCell>
              {(centralityValue?.[Number(id)] ?? 0).toFixed(4)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}