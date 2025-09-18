"use client";
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";


import { ColumnFilterIcon } from "@/components/icon/IconFilter";
import { EditTabIcon } from "@/components/icon/IconAction";
import PickColumnModal from "../../../app/work/(workgroup)/sentiment/modal/PickColumnModal";

export default function TargetFilter() {
  const {
    isOpen: isTargetPick,
    onOpen: onTargetPick,
    onOpenChange: onTargetPickChange,
    onClose: onTargetCloseModal
  } = useDisclosure();
  

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
          startContent={<EditTabIcon className="w-4" />}
            size="sm"
            className="text-black dark:text-white"
            color="primary"
            variant="light"
          >
            Target
          </Button>
        </DropdownTrigger>
        <DropdownMenu color="primary" variant="flat" aria-label="File actions">
          <DropdownItem
            key="column-pick"
            description="Choose your text data"
            startContent={<ColumnFilterIcon className="w-6" />}
            onPress={onTargetPick}
          >
            Column Text
          </DropdownItem>
          
        </DropdownMenu>
      </Dropdown>
      <PickColumnModal onClose={onTargetCloseModal} isOpen={isTargetPick} onOpenChange={onTargetPickChange} />
    </>
  );
}
