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
              radius="sm"
              size="md"
              variant="light"
              endContent={<DropDownNavIcon className="w-2" />}
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
            href="/sentiment_analysis"
            key="Sentiment Analysis"
            description="Detect polarity and emotional tone"
            startContent={<SentimentNavIcon className="stroke-red-500" />}
          >
            Sentiment Analysis
          </DropdownItem>
          <DropdownItem
            href="/keyword_extraction"
            key="Keywords Extraction"
            description="Highlight the most important words and phrases"
            startContent={<ExtractionNavIcon className="stroke-blue-500" />}
          >
            Keywords Extraction
          </DropdownItem>
          <DropdownItem
            href="/zeroshot_classification"
            key="Zero-Shot Classification"
            description="Classify text into custom labels"
            startContent={<ZeroshotNavIcon className="stroke-green-500" />}
          >
            Zero-Shot Classification
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
