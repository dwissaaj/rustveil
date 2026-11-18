"use client";
import {
  Select,
  SelectItem,
  Radio,
  RadioGroup,
  Tooltip,
  Button,
} from "@heroui/react";
import { useAtom } from "jotai";

import {
  columnAvailable,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
} from "@/app/lib/data/state";
import { TooltipIcon, VerticesIcon } from "@/components/icon/IconFilter";

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
              color="primary"
              endContent={<TooltipIcon className="w-6" />}
              variant="light"
            >
              Available Nodes
            </Button>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-4">
          <Select
            className="max-w-lg"
            color="primary"
            label="Select 1st Vertices"
            labelPlacement="outside"
            placeholder="Choose a column"
            startContent={<VerticesIcon />}
            value={vertex1} // controlled
            variant="underlined"
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
            color="primary"
            label="Select 2nd Vertices"
            labelPlacement="outside"
            placeholder="Choose a column"
            startContent={<VerticesIcon />}
            value={vertex2} // controlled
            variant="underlined"
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
              color="default"
              endContent={<TooltipIcon />}
              variant="light"
            >
              Available Nodes
            </Button>
          </Tooltip>
        </div>
        <div className="ml-2">
          <RadioGroup
            orientation="horizontal"
            size="md"
            value={graphType}
            onValueChange={(value: string) => setGraphType(value)}
          >
            <Radio value="direct">Direct</Radio>
            <Radio value="undirect">Undirect</Radio>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
