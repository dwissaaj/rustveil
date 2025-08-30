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
import { columnAvailable } from "@/app/lib/workstation/data/state";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import { TooltipIcon } from "@/components/icon/IconFilter";
import {
  Select,
  SelectItem,
  Radio,
  RadioGroup,
  Tooltip,
  Button,
} from "@heroui/react";
import { useAtom } from "jotai";

export default function VerticesSelectComponent() {

  const [column, setColumn] = useAtom(columnAvailable);
  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div>
          <Tooltip color="primary" content="Minimal 2 data for edges">
            <Button
              variant="light"
              color="default"
              endContent={<TooltipIcon />}
            >
              Available Nodes
            </Button>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-4">
            

         
          
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <Tooltip color="primary" content="Read blogs to understand both type">
            <Button
              variant="light"
              color="default"
              endContent={<TooltipIcon />}
            >
              Available Nodes
            </Button>
          </Tooltip>
        </div>
        <div className="ml-2">
          {/* <RadioGroup
            value={graphType}
            onValueChange={(value: string) => setGraphType(value)}
            size="md"
            orientation="horizontal"
          >
            <Radio value="direct">Direct</Radio>
            <Radio value="undirect">Undirect</Radio>
          </RadioGroup> */}
        </div>
      </div>
    </div>
  );
}
