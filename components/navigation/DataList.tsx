"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { DataNavIcon, DropDownNavIcon } from "../icon/IconNavigation";

export default function DataList() {
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
              Data
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="Classification Task"
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            startContent={<DataNavIcon className="stroke-yellow-500" />}
            href="/data"
            key="Data"
            description="Upload and handle dataset"
          >
            Data
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
