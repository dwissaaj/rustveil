"use client";
import {
  columnAvailable,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
} from "@/app/lib/workstation/data/state";

import { TooltipIcon, VerticesIcon } from "@/components/icon/IconFilter";
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
  const [column] = useAtom(columnAvailable);
  const [vertex1, setVertex1] = useAtom(vertex1ColumnSelected);
  const [vertex2, setVertex2] = useAtom(vertex2ColumnSelected);
  const [graphType, setGraphType] = useAtom(vertexGraphTypeSelected);

  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div>
          <Tooltip color="primary" content="Minimal 2 data for edges">
            <Button
              className="text-black dark:text-white"
              variant="light"
              color="primary"
              endContent={<TooltipIcon className="w-6" />}
            >
              Available Nodes
            </Button>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-4">
          <Select
            className="max-w-lg"
            label="Select 1st Vertices"
            placeholder="Choose a column"
            variant="underlined"
            color="primary"
            labelPlacement="outside"
            startContent={<VerticesIcon />}
            value={vertex1} // controlled
            onChange={(event) => {
              const value = event.target.value;
              setVertex1(value);
            }}
          >
            {column.map((col) => (
              <SelectItem key={col}>{col}</SelectItem>
            ))}
          </Select>
          <Select
            className="max-w-lg"
            label="Select 2nd Vertices"
            placeholder="Choose a column"
            variant="underlined"
            color="primary"
            labelPlacement="outside"
            startContent={<VerticesIcon />}
            value={vertex2} // controlled
            onChange={(event) => {
              const value = event.target.value;
              setVertex2(value);
            }}
          >
            {column.map((col) => (
              <SelectItem key={col}>{col}</SelectItem>
            ))}
          </Select>
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
          <RadioGroup
            value={graphType}
            onValueChange={(value: string) => setGraphType(value)}
            size="md"
            orientation="horizontal"
          >
            <Radio value="direct">Direct</Radio>
            <Radio value="undirect">Undirect</Radio>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
