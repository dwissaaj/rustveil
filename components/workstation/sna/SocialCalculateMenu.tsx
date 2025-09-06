"use client";
import VerticesModal from "@/app/work/(workgroup)/social_network/filter/modal/EdgesModal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  useDisclosure,
  DropdownItem,
  Button,
} from "@heroui/react";
import { VerticesIcon } from "@/components/icon/IconFilter";
import SocialCalculateModal from "@/app/work/(workgroup)/social_network/filter/modal/CalculateModal";
import { CalculateIcon } from "@/components/icon/IconGraph";


export default function SocialCalculateMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="text-black dark:text-white" color="primary" variant="light" >Calculate</Button>
        </DropdownTrigger>
        <DropdownMenu color="primary" variant="flat" aria-label="Calculate graph metrics">
          <DropdownItem
            onPress={onOpen}
            startContent={<CalculateIcon className="w-6" />}
            description="Compute social network metrics"
            key="calculate"
          >
            Calculate Metrics
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <SocialCalculateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
