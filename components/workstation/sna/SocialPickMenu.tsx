"use client";
import VerticesModal from "@/app/work/(workgroup)/social_network/filter/modal/VerticesModal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  useDisclosure,
  DropdownItem,
  Button,
} from "@heroui/react";
import { VerticesIcon } from "@/components/icon/IconFilter";

export default function SocialPickMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Nodes</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Action event example">
          <DropdownItem textValue="vertices" key="new">
            <Button
              className="w-full"
              endContent={<VerticesIcon />}
              onPress={onOpen}
            >
              Locate Vertices
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <VerticesModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
