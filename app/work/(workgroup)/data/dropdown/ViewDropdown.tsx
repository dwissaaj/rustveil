import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { RefreshIcon } from "@/components/icon/IconView";
import { useRefreshServer } from "@/app/lib/workstation/data/handler/server/useRefreshServer";

export interface ViewDropdownProps {
  onDataFetched?: (data: any[], totalCount?: number) => void;
}

export function ViewDropdown({ onDataFetched }: ViewDropdownProps) {
  const { refresh } = useRefreshServer(onDataFetched);

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
