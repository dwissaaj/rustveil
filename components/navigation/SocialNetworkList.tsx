"use client";
import {
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";

import { DropDownNavIcon, SocialNavIcon } from "../icon/IconNavigation";

export default function SocialNetworkList() {
  return (
    <>
      <Dropdown>
        <NavbarItem>
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-2 font-semibold"
              endContent={<DropDownNavIcon className="w-2" />}
              radius="sm"
              size="md"
              variant="light"
            >
              Social Network
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="Social Network Task"
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            key="Social Network Analysis"
            description="Map and analyze relationships between actors in a network"
            href="/social_network"
            startContent={<SocialNavIcon className="stroke-green-500" />}
          >
            Social Network Analysis
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
