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
              radius="sm"
              size="md"
              variant="light"
              endContent={<DropDownNavIcon className="w-2" />}
            >
              Entity & Structure
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          disabledKeys={["Relation Extraction"]}
          aria-label="Entity & Structure Task"
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            startContent={<NerNavIcon className="stroke-cyan-500" />}
            href="/ner"
            key="Named Entity Recognition"
            description="Identify entity label inside data"
          >
            Named Entity Recognition (NER)
          </DropdownItem>
          <DropdownItem
            startContent={<PosNavIcon className="stroke-purple-500" />}
            href="/pos_tagging"
            key="Part of Speech tagging"
            description="Extracts Part of Speech tags"
          >
            Part of Speech tagging
          </DropdownItem>
          <DropdownItem
            startContent={<RelationNavIcon className="stroke-rose-500" />}
            key="Relation Extraction"
            description="Relation between words in sentence"
          >
            Relation Extraction
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
