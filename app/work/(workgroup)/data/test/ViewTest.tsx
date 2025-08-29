import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { RefreshIcon } from "@/components/icon/IconView";
import { useRefTest } from "./useRefTest";

export interface ViewTestProps {
  onDataFetched?: (data: any[], totalCount?: number) => void;
}

export function ViewTest({ onDataFetched }: ViewTestProps) {
  const { refresh } = useRefTest(onDataFetched);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">View</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="File actions">
        <DropdownItem
          onPress={() => refresh(1)} // 👈 WRAP IN ARROW FUNCTION
          shortcut="⌘R"
          description="Check new data"
          key="refresh"
          startContent={<RefreshIcon />}
        >
          Refresh
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}