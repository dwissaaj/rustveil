// components/DualColumnSelect.tsx
'use client'
import { useColumnShow } from '@/app/lib/workstation/social/GetColumn';
import { Select, SelectItem } from '@heroui/react';


export default function DualColumnSelect() {
  const { 
    headers,
    vertex1, setVertex1,
    vertex2, setVertex2
  } = useColumnShow();

  return (
    <div className="space-y-4">
      {/* Vertex 1 Selector */}
      <Select
        label="Select Vertex 1"
        selectedKeys={vertex1 ? [vertex1] : []}
        onSelectionChange={(keys) => setVertex1(Array.from(keys)[0] as string)}
      >
        {headers.map((header) => (
          <SelectItem 
            key={header} 
        
          >
            {header}
          </SelectItem>
        ))}
      </Select>

      {/* Vertex 2 Selector */}
      <Select
        label="Select Vertex 2"
        selectedKeys={vertex2 ? [vertex2] : []}
        onSelectionChange={(keys) => setVertex2(Array.from(keys)[0] as string)}
      >
        {headers.map((header) => (
          <SelectItem
            key={header}
          >
            {header}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}