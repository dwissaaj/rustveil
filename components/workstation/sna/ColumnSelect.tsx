/**
 * Dual column selector for vertex analysis
 *
 * @component
 * @example
 * <DualColumnSelect />
 *
 * @description
 * Provides two synchronized dropdown selectors for choosing vertex columns.
 * Maintains selection state via useColumnShow hook.
 *
 * @hooks
 * - useColumnShow: Manages available headers and selection state
 *
 * @ui
 * - Hero UI Select components
 * - Vertical spacing (space-y-4)
 * - Clear selection labels
 *
 * @behavior
 * - Converts SelectionChange events to string values
 * - Handles empty selection state
 * - Synchronizes with parent component state
 *
 * @props
 * - Uses headers from useColumnShow for options
 * - Maintains vertex1 and vertex2 selections
 */
"use client";
import { useColumnShow } from "@/app/lib/workstation/social/GetColumn";
import { Select, SelectItem } from "@heroui/react";

export default function DualColumnSelect() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 } = useColumnShow();

  return (
    <div className="space-y-4">
      <Select
        label="Select Vertex 1"
        selectedKeys={vertex1 ? [vertex1] : []}
        onSelectionChange={(keys) => setVertex1(Array.from(keys)[0] as string)}
      >
        {headers.map((header) => (
          <SelectItem key={header}>{header}</SelectItem>
        ))}
      </Select>

      {/* Vertex 2 Selector */}
      <Select
        label="Select Vertex 2"
        selectedKeys={vertex2 ? [vertex2] : []}
        onSelectionChange={(keys) => setVertex2(Array.from(keys)[0] as string)}
      >
        {headers.map((header) => (
          <SelectItem key={header}>{header}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
