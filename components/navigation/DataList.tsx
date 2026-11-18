"use client";
import {
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
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
              endContent={<DropDownNavIcon className="w-2" />}
              radius="sm"
              size="md"
              variant="light"
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
            key="Data"
            description="Upload and handle dataset"
            href="/data"
            startContent={<DataNavIcon className="stroke-yellow-500" />}
          >
            Data
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
