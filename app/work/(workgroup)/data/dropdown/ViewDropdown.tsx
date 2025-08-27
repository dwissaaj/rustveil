import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  addToast,
} from "@heroui/react";
import { RefreshIcon } from "@/components/icon/IconView";
import { useGetAllData } from '@/app/lib/workstation/data/handler/useGetAllData';
import { useRefresh } from '@/app/lib/workstation/data/handler/useRefresh';


export function ViewDropdown({ onDataFetched }: { onDataFetched: (data: any[]) => void }) {

  const { refresh } = useRefresh(onDataFetched);
  
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">View</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="File actions">
        <DropdownItem 
          onPress={refresh} 
          shortcut="⌘R" 
          description='Check new data' 
          key="refresh" 
          startContent={<RefreshIcon />}
        >
          Refresh
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}