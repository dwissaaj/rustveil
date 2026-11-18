"use client";
import {
  Dropdown,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import PickColumnModal from "../../app/sentiment_analysis/modal/PickColumnModal";
import { SettingViewOutline } from "../icon/IconView";

import { ColumnFilterSolid } from "@/components/icon/IconFilter";
import SettingModel from "@/app/sentiment_analysis/modal/SettingModelModal";

export default function TargetSentimentFilter() {
  const {
    isOpen: isTargetPick,
    onOpen: onTargetPick,
    onOpenChange: onTargetPickChange,
    onClose: onTargetCloseModal,
  } = useDisclosure();

  const {
    isOpen: isSettingOpen,
    onOpen: onSettingOpen,
    onClose: onSettingCloseModal,
    onOpenChange: onSettingOpenChange,
  } = useDisclosure();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="text-black dark:text-white"
            color="primary"
            size="sm"
            startContent={<SettingViewOutline className="w-2" />}
            variant="light"
          >
            Setting
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions" color="primary" variant="flat">
          <DropdownItem
            key="column-pick"
            description="Choose your text data"
            startContent={<ColumnFilterSolid className="w-6" />}
            onPress={onTargetPick}
          >
            Target Column
          </DropdownItem>
          <DropdownItem
            key="custom-model"
            description="Custom Your Params"
            startContent={<SettingViewOutline className="w-6" />}
            onPress={onSettingOpen}
          >
            Custom Model
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <PickColumnModal
        isOpen={isTargetPick}
        onClose={onTargetCloseModal}
        onOpenChange={onTargetPickChange}
      />
      <SettingModel
        isOpen={isSettingOpen}
        onClose={onSettingCloseModal}
        onOpenChange={onSettingOpenChange}
      />
    </>
  );
}
