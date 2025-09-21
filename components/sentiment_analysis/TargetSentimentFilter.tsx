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
import PickColumnModal from "../../app/sentiment_analysis/modal/PickColumnModal";
import { SettingViewOutline } from "../icon/IconView";

export default function TargetSentimentFilter() {
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
          startContent={<SettingViewOutline className="w-2" />}
            size="sm"
            className="text-black dark:text-white"
            color="primary"
            variant="light"
          >
            Setting
          </Button>
        </DropdownTrigger>
        <DropdownMenu color="primary" variant="flat" aria-label="File actions">
          <DropdownItem
            key="column-pick"
            description="Choose your text data"
            startContent={<ColumnFilterIcon className="w-6" />}
            onPress={onTargetPick}
          >
            Target Column
          </DropdownItem>
          
        </DropdownMenu>
      </Dropdown>
      <PickColumnModal onClose={onTargetCloseModal} isOpen={isTargetPick} onOpenChange={onTargetPickChange} />
    </>
  );
}
