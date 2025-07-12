import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import React from "react";
import { Select, SelectItem, Chip } from "@heroui/react";
export default function EdgesSelection() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useGraphData();
  return (
    <>
      <div className="flex flex-row gap-4 ">
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
      <div className="flex flex-row gap-2 mb-4">
        {vertex1 && <Chip color="primary">{vertex1}</Chip>}
        {vertex2 && <Chip color="secondary">{vertex2}</Chip>}
      </div>
    </>
  );
}
