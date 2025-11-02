import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import { RefreshIcon } from "@/components/icon/IconView";
import { useRefreshServer } from "@/app/lib/data/handler/server/useRefreshServer";
import { ViewTabIcon } from "@/components/icon/IconAction";

export interface ViewDropdownProps {
  onDataFetched?: (data: any[], totalCount?: number) => void;
}

export function ViewDropdown({ onDataFetched }: ViewDropdownProps) {
  const { refresh } = useRefreshServer(onDataFetched);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
         className="text-black dark:text-white"
          color="primary"
          startContent={<ViewTabIcon className="w-4" />}
          size="sm"
         
          variant="light"
        >
          View
        </Button>
      </DropdownTrigger>
      <DropdownMenu color="primary" variant="flat" aria-label="view actions">
        <DropdownItem
          key="refresh"
          description="Check new data"
          startContent={<RefreshIcon className="w-6" />}
          onPress={() => refresh(1)}
        >
          Refresh
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
