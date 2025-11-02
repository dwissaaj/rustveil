import { useAtomValue } from "jotai";
import Image from "next/image";
import { Chip } from "@heroui/react";
import Link from "next/link";

import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";

import { ColumnFilterOutline, LanguageIcon } from "@/components/icon/IconSA";

export default function MultiLangModelInfo() {
  const selectedLanguage = useAtomValue(selectedLang);
  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);

  return (
    <div className="p-2 space-y-4">
      <div className="space-y-4">
        <div>
          <strong>Tabularisai/multilingual-sentiment-analysis</strong>
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
          src="/model/multilingual-sentiment-analysis.png"
          width={500}
        />
      </div>
      <div>
        <strong className="text-xl">Description</strong>
        <p>
          Multi language sentiment analysis created by tabularisai derived from
          distilbert/distilbert-base-multilingual-cased
        </p>
      </div>
      <div className="">
        <strong className="text-xl">Model Details</strong>
        <ul className="list-disc">
          <li>
            <strong>Developed by:</strong> tabularisai
          </li>
          <li>
            <strong>Model Type:</strong> Text Classification
          </li>
          <li>
            <strong>Language(s):</strong> Chinese (中文), Spanish (Español),
            Arabic (العربية), Japanese (日本語), German (Deutsch), Malay (Bahasa
            Melayu), Vietnamese (Tiếng Việt), Korean (한국어), French
            (Français), Tagalog
          </li>
          <li>
            <strong>License:</strong> Mit
          </li>
        </ul>
      </div>
      <div className="space-y-2">
        <strong className="text-xl">Label</strong>
        <div className="flex flex-col gap-2 ">
          <Chip size="md" variant="flat">
            0: Very Negative
          </Chip>
          <Chip size="md" variant="flat">
            1: Negative
          </Chip>
          <Chip size="md" variant="flat">
            2: Neutral
          </Chip>
          <Chip size="md" variant="flat">
            3: Positive
          </Chip>
          <Chip size="md" variant="flat">
            4: Very Positive
          </Chip>
        </div>
      </div>

      <div>
        <strong className="text-xl">Training Procedure</strong>
        <ul className="list-disc">
          <li>train_acc_off_by_one = 0.93</li>
          <li>num_train_epochs = 3.5</li>
        </ul>
      </div>
      <div>
        <strong className="text-xl">Resources</strong>
        <div className="flex flex-col gap-2">
          <ul className="list-disc">
            <li>
              <Link
                color="foreground"
                href="https://discord.com/invite/sznxwdqBXj"
                rel="noopener noreferrer"
                target="_blank"
              >
                Tabularisai discord
              </Link>
            </li>
            <li>
              <Link
                color="foreground"
                href="https://huggingface.co/tabularisai/multilingual-sentiment-analysis"
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
