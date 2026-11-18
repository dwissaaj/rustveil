"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  useDisclosure,
  DropdownItem,
  Button,
} from "@heroui/react";

import SocialCalculateModal from "@/app/social_network/filter/modal/CalculateModal";
import { CalculateIcon } from "@/components/icon/IconGraph";
import { CalculateTabIcon } from "@/components/icon/IconAction";

export default function SocialCalculateMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="text-black dark:text-white"
            color="primary"
            size="sm"
            startContent={<CalculateTabIcon />}
            variant="light"
          >
            Calculate
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Calculate graph metrics"
          color="primary"
          variant="flat"
        >
          <DropdownItem
            key="calculate"
            description="Compute social network metrics"
            startContent={<CalculateIcon className="w-6" />}
            onPress={onOpen}
          >
            Calculate Metrics
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <SocialCalculateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
