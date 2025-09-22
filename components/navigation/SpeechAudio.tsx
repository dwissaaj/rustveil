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
              radius="sm"
              size="md"
              variant="light"
              endContent={<DropDownNavIcon className="w-2" />}
            >
              Speech & Audio
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          disabledKeys={["Audio Classification"]}
          aria-label="Speech & Audio Task"
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            startContent={<AsrNavIcon className="stroke-lime-500" />}
            href="/asr"
            key="Automatic Speech Recognition"
            description="Transcribe spoken audio into text"
          >
            Automatic Speech Recognition (ASR)
          </DropdownItem>
          <DropdownItem
            startContent={
              <AudioClassificationNavIcon className="stroke-teal-500" />
            }
            key="Audio Classification"
            description="Analyze audio and categorize"
          >
            Audio Classification
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
