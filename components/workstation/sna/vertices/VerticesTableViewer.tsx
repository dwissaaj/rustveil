import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
interface Vertex {
  id: number;
  username: string;
  centrality: number;
}

interface VerticesTableViewerProps {
  vertices: Vertex[];
}
export function VerticesTableViewer({ vertices }: VerticesTableViewerProps) {
  return (
    <Table aria-label="Centrality Results" isStriped isVirtualized>
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>Username</TableColumn>
        <TableColumn>Centrality</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No Vertices to show"}>
        {vertices.map((vertex) => (
          <TableRow key={vertex.id}>
            <TableCell>{vertex.id}</TableCell>
            <TableCell>{vertex.username}</TableCell>
            <TableCell>{vertex.centrality.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
