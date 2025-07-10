import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export function VerticesTableViewer() {
  const { graphData } = useGraphData();

  return (
    <Table aria-label="Centrality Results" isStriped isVirtualized>
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>Username</TableColumn>
        <TableColumn>Centrality</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No Vertices to show"}>
        {graphData.map((vertices) => (
          <TableRow key={vertices.id}>
            <TableCell>{vertices.id}</TableCell>
            <TableCell>{vertices.username}</TableCell>
            <TableCell>{vertices.centrality}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
