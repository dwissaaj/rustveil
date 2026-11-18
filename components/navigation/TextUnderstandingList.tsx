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
  ExtractionNavIcon,
  SentimentNavIcon,
  ZeroshotNavIcon,
} from "../icon/IconNavigation";

export default function TextUnderstandingList() {
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
              Text Understanding
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="Text Understanding dropdown"
          itemClasses={{
            base: "gap-4",
          }}
        >
          <DropdownItem
            key="Sentiment Analysis"
            description="Detect polarity and emotional tone"
            href="/sentiment_analysis"
            startContent={<SentimentNavIcon className="stroke-red-500" />}
          >
            Sentiment Analysis
          </DropdownItem>
          <DropdownItem
            key="Keywords Extraction"
            description="Highlight the most important words and phrases"
            href="/keyword_extraction"
            startContent={<ExtractionNavIcon className="stroke-blue-500" />}
          >
            Keywords Extraction
          </DropdownItem>
          <DropdownItem
            key="Zero-Shot Classification"
            description="Classify text into custom labels"
            href="/zeroshot_classification"
            startContent={<ZeroshotNavIcon className="stroke-green-500" />}
          >
            Zero-Shot Classification
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
