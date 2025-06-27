'use client'
import VerticesModal from "@/app/work/(workgroup)/social_network/filter/modal/VerticesModal";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";


export default function SocialPickMenu() {

  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>
        <Button variant="bordered">Nodes</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example" >
        <DropdownItem   textValue="vertices" key="new">
          <VerticesModal />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
