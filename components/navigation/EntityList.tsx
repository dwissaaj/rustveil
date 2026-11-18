"use client";
import {
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";

import {
  DropDownNavIcon,
  NerNavIcon,
  PosNavIcon,
  RelationNavIcon,
} from "../icon/IconNavigation";

export default function EntityList() {
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
              Entity & Structure
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="Entity & Structure Task"
          disabledKeys={["Relation Extraction"]}
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            key="Named Entity Recognition"
            description="Identify entity label inside data"
            href="/ner"
            startContent={<NerNavIcon className="stroke-cyan-500" />}
          >
            Named Entity Recognition (NER)
          </DropdownItem>
          <DropdownItem
            key="Part of Speech tagging"
            description="Extracts Part of Speech tags"
            href="/pos_tagging"
            startContent={<PosNavIcon className="stroke-purple-500" />}
          >
            Part of Speech tagging
          </DropdownItem>
          <DropdownItem
            key="Relation Extraction"
            description="Relation between words in sentence"
            startContent={<RelationNavIcon className="stroke-rose-500" />}
          >
            Relation Extraction
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
