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
        <Button
          size="lg"
          className="text-black dark:text-white"
          color="primary"
          variant="light"
        >
          View
        </Button>
      </DropdownTrigger>
      <DropdownMenu color="primary" variant="flat" aria-label="view actions">
        <DropdownItem
          key="refresh"
          description="Check new data"
          shortcut="⌘R"
          startContent={<RefreshIcon className="w-6" />}
          onPress={() => refresh(1)} // 👈 WRAP IN ARROW FUNCTION
        >
          Refresh
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
