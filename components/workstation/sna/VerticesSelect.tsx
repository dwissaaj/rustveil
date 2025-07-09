/**
 * Dual column selector for vertex analysis
 *
 * @component
 * @example
 * 
 *
 * @description
 * Provides two synchronized dropdown selectors for choosing vertex columns.
 * Maintains selection state via useGraphData hook.
 *
 * @hooks
 * - useGraphData: Manages available headers and selection state
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
 * - Uses headers from useGraphData for options
 * - Maintains vertex1 and vertex2 selections
 */
"use client";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { TooltipIcon } from "@/components/icon/IconFilter";
import { Select, SelectItem , Radio, RadioGroup, Tooltip, Button} from "@heroui/react";

export default function VerticesSelect() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2, graphType, setGraphType } = useGraphData();

  
  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div>
          <Tooltip color="primary" content="Minimal 2 data for edges" >
          <Button variant="light" color="default" endContent={<TooltipIcon />}>
            Available Nodes
          </Button>
       </Tooltip>
        </div>
        <div className="flex flex-col gap-4">
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
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <Tooltip color="primary" content="Read blogs to understand both type" >
          <Button variant="light" color="default" endContent={<TooltipIcon />}>
            Available Nodes
          </Button>
       </Tooltip>
        </div>
           <div className="ml-2">
            <RadioGroup
              value={graphType}
              onValueChange={(value: string) => setGraphType(value)} 
              size="md" orientation="horizontal">
              <Radio value="direct">Direct</Radio>
              <Radio value="undirect">Undirect</Radio>
            </RadioGroup>
           </div>
      </div>
    </div>
  );
}
