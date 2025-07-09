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

export default function SocialCalculateMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Calculate</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Action event example">
          <DropdownItem textValue="vertices" key="new">
            <Button
              className="w-full"
              endContent={<VerticesIcon />}
              onPress={onOpen}
            >
              Calculate
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <SocialCalculateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
