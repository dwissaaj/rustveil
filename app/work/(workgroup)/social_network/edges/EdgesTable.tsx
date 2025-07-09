"use client";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import VertexTable from "@/components/workstation/sna/EdgesTable";
import { Select, SelectItem, Chip } from "@heroui/react";
/**
 * Vertex selection and display interface for social network analysis
 *
 * @component
 * @example
 * <VerticesTable />
 *
 * @description
 * Combines vertex selection controls with data display:
 * - Dual column selectors
 * - Active selection indicators
 * - Integrated VertexTable display
 *
 * @hooks
 * - useGraphData: Manages column state and data
 *
 * @ui
 * - Horizontal select controls (gap-4)
 * - Chip indicators for active selections
 * - Responsive spacing (space-y-4)
 * - Hero UI Select and Chip components
 *
 * @behavior
 * - Synchronized selection between dropdowns
 * - Real-time table updates
 * - Visual feedback for selected vertices
 *
 * @composition
 * - Embeds VertexTable component
 * - Manages selection state via useGraphData
 */

export default function EdgesTable() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useGraphData();

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          label="Vertex 1"
          selectedKeys={vertex1 ? [vertex1] : []}
          onSelectionChange={(keys) =>
            setVertex1(Array.from(keys)[0] as string)
          }
        >
          {headers.map((header) => (
            <SelectItem key={header}>{header}</SelectItem>
          ))}
        </Select>

        <Select
          label="Vertex 2"
          selectedKeys={vertex2 ? [vertex2] : []}
          onSelectionChange={(keys) =>
            setVertex2(Array.from(keys)[0] as string)
          }
        >
          {headers.map((header) => (
            <SelectItem key={header}>{header}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex gap-2">
        {vertex1 && <Chip color="primary">{vertex1}</Chip>}
        {vertex2 && <Chip color="secondary">{vertex2}</Chip>}
      </div>

      <VertexTable />
    </div>
  );
}
