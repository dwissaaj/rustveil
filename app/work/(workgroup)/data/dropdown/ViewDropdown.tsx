import React from 'react'
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  addToast,
  Alert,
} from "@heroui/react";
import { RefreshIcon } from "@/components/icon/IconView";
import { useGetAllData } from '@/app/lib/workstation/data/handler/useGetAllData';
interface ViewDropdownProps {
  onRefresh: (data: Record<string, any>[]) => void;
}

export default function ViewDropdown({ onRefresh }: ViewDropdownProps) {
  const getData = useGetAllData()

  const refresh = async () => {
    try {
      const result = await getData()
      console.log(result)
      if (result?.response_code === 200 && result.data) {
        // ✅ CALL onRefresh WITH THE DATA
        onRefresh(result.data);
        addToast({
          title: "Success",
          description: "Data refreshed successfully",
          color: "success",
        });
      } else {
        addToast({
          title: "Operation Error",
          description: `${result?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light">View</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions">
          <DropdownItem onPress={refresh} shortcut="⌘R" description='Check new data' key="refresh"  startContent={<RefreshIcon />} >
              Refresh
          </DropdownItem>
          
        </DropdownMenu>
      </Dropdown>
      </>
  )
}
