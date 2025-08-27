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


export function ViewDropdown({ onDataFetched }: { onDataFetched: (data: any[]) => void }) {
  const getData = useGetAllData();

  const refresh = async () => {
    try {
      const result = await getData();
      console.log(result);
      
      if (result?.response_code === 200 && result.data) {
        onDataFetched(result.data);
        addToast({
          title: "Success",
          description: `${result.message}`,
          color: "success",
        });
      } else {
        addToast({
          title: "Error at Fetch",
          description: `${result?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      console.log(error);
      addToast({
        title: "Error",
        description: "Refresh failed",
        color: "danger",
      });
    }
  };

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