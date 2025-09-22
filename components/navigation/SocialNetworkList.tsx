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
              radius="sm"
              size="md"
              variant="light"
              endContent={<DropDownNavIcon className="w-2" />}
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
            href="/social_network"
            key="Social Network Analysis"
            startContent={<SocialNavIcon className="stroke-green-500" />}
            description="Map and analyze relationships between actors in a network"
          >
            Social Network Analysis
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
