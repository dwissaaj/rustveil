"use client";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import EdgesTableViewer from "@/components/workstation/sna/EdgesTableViewer";
import { Select, SelectItem, Chip } from "@heroui/react";

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

      <EdgesTableViewer />
    </div>
  );
}
