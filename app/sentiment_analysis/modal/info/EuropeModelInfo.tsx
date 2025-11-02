import { useAtomValue } from "jotai";
import Image from "next/image";
import { Chip } from "@heroui/react";
import Link from "next/link";

import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";

import {
  ColumnFilterOutline,
  LanguageIcon,
  StarIconOutline,
} from "@/components/icon/IconSA";

export default function EuropeModelInfo() {
  const selectedLanguage = useAtomValue(selectedLang);
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);

  return (
    <div className="p-2 space-y-4">
      <div className="space-y-4">
        <div>
          <strong>Nlptown/bert-base-multilingual-uncased-sentiment</strong>
        </div>
        <div className="flex flex-row gap-4">
          <Chip
            className="p-2"
            color="primary"
            radius="lg"
            startContent={<LanguageIcon className="size-6" />}
            variant="flat"
          >
            <p className="text-md">{selectedLanguage}</p>
          </Chip>
          <Chip
            color="primary"
            radius="lg"
            startContent={<ColumnFilterOutline className="size-6" />}
            variant="flat"
          >
            {columnTarget}
          </Chip>
        </div>
      </div>
      <div>
        <Image
          alt="Europe Model"
          className="rounded-lg shadow"
          height={150}
          src="/model/bert-base-multilingual-uncased-sentiment.png"
          width={500}
        />
      </div>
      <div>
        <strong className="text-xl">Description</strong>
        <p>
          bert-base-multilingual-uncased model finetuned for sentiment analysis
          created by nlptown best is train from review data, best used for
          product review
        </p>
      </div>
      <div className="">
        <strong className="text-xl">Model Details</strong>
        <ul className="list-disc">
          <li>
            <strong>Developed by:</strong> Nlptown
          </li>
          <li>
            <strong>Model Type:</strong> Text Classification
          </li>
          <li>
            <strong>Language(s):</strong> Dutch, Germany, French
          </li>
          <li>
            <strong>License:</strong> Mit
          </li>
        </ul>
      </div>
      <div className="space-y-2">
        <strong className="text-xl">Label</strong>
        <div className="space-x-2">
          <Chip
            color="danger"
            endContent={<StarIconOutline className="size-4" />}
            size="md"
            variant="flat"
          >
            0
          </Chip>
          <Chip
            color="danger"
            endContent={<StarIconOutline className="size-4" />}
            size="md"
            variant="flat"
          >
            1
          </Chip>
          <Chip
            color="danger"
            endContent={<StarIconOutline className="size-4" />}
            size="md"
            variant="flat"
          >
            2
          </Chip>
          <Chip
            color="danger"
            endContent={<StarIconOutline className="size-4" />}
            size="md"
            variant="flat"
          >
            3
          </Chip>
          <Chip
            color="danger"
            endContent={<StarIconOutline className="size-4" />}
            size="md"
            variant="flat"
          >
            4
          </Chip>
        </div>
      </div>

      <div>
        <strong className="text-xl">Resources</strong>
        <div className="flex flex-col gap-2">
          <ul className="list-disc">
            <li>
              <Link
                color="foreground"
                href="https://www.nlp.town/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Nlp Town Website
              </Link>
            </li>
            <li>
              <Link
                color="foreground"
                href="https://huggingface.co/nlptown/bert-base-multilingual-uncased-sentiment"
                rel="noopener noreferrer"
                target="_blank"
              >
                Huggingface Documentation
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
