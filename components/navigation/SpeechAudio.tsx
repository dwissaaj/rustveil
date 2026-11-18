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
  AsrNavIcon,
  AudioClassificationNavIcon,
  DropDownNavIcon,
} from "../icon/IconNavigation";

export default function SpeechAudioList() {
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
              Speech & Audio
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="Speech & Audio Task"
          disabledKeys={["Audio Classification"]}
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            key="Automatic Speech Recognition"
            description="Transcribe spoken audio into text"
            href="/asr"
            startContent={<AsrNavIcon className="stroke-lime-500" />}
          >
            Automatic Speech Recognition (ASR)
          </DropdownItem>
          <DropdownItem
            key="Audio Classification"
            description="Analyze audio and categorize"
            startContent={
              <AudioClassificationNavIcon className="stroke-teal-500" />
            }
          >
            Audio Classification
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
