import { useAtomValue } from "jotai";
import Image from "next/image";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";
import { Chip } from "@heroui/react";

import {
  ColumnFilterOutline,
  LanguageIcon,
  StarIconOutline,
} from "@/components/icon/IconSA";
import Link from "next/link";

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
            startContent={<LanguageIcon className="size-6" />}
            color="primary"
            radius="lg"
            variant="flat"
          >
            <p className="text-md">{selectedLanguage}</p>
          </Chip>
          <Chip
            startContent={<ColumnFilterOutline className="size-6" />}
            color="primary"
            radius="lg"
            variant="flat"
          >
            {columnTarget}
          </Chip>
        </div>
      </div>
      <div>
        <Image
          src="/model/bert-base-multilingual-uncased-sentiment.png"
          alt="Europe Model"
          width={500}
          height={150}
          className="rounded-lg shadow"
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
            variant="flat"
            color="danger"
            size="md"
            endContent={<StarIconOutline className="size-4" />}
          >
            0
          </Chip>
          <Chip
            variant="flat"
            color="danger"
            size="md"
            endContent={<StarIconOutline className="size-4" />}
          >
            1
          </Chip>
          <Chip
            variant="flat"
            color="danger"
            size="md"
            endContent={<StarIconOutline className="size-4" />}
          >
            2
          </Chip>
          <Chip
            variant="flat"
            color="danger"
            size="md"
            endContent={<StarIconOutline className="size-4" />}
          >
            3
          </Chip>
          <Chip
            variant="flat"
            color="danger"
            size="md"
            endContent={<StarIconOutline className="size-4" />}
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
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.nlp.town/"
              >
                Nlp Town Website
              </Link>
            </li>
            <li>
              <Link
                color="foreground"
                rel="noopener noreferrer"
                target="_blank"
                href="https://huggingface.co/nlptown/bert-base-multilingual-uncased-sentiment"
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
