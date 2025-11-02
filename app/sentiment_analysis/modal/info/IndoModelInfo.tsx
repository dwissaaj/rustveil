import { useAtomValue } from "jotai";
import Image from "next/image";
import { Chip } from "@heroui/react";
import Link from "next/link";

import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";

import { LanguageIcon, ColumnFilterOutline } from "@/components/icon/IconSA";

export default function IndoModelInfo() {
  const selectedLanguage = useAtomValue(selectedLang);

  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);

  return (
    <div className="p-2 space-y-4">
      <div className="space-y-4">
        <div>
          <strong>Agufsamudra/indo-sentiment-analysis</strong>
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
          alt="English Model"
          className="rounded-lg shadow"
          height={150}
          src="/model/indo-sentiment-analysis.png"
          width={500}
        />
      </div>
      <div>
        <strong className="text-xl">Description</strong>
        <p>
          Fine tuned by agufsamudra from indobenchmark/indobert-base-p1 for
          sentiment analysis
        </p>
      </div>
      <div className="">
        <strong className="text-xl">Model Details</strong>
        <ul className="list-disc">
          <li>
            <strong>Developed by:</strong> agufsamudra
          </li>
          <li>
            <strong>Model Type:</strong> Text Classification
          </li>
          <li>
            <strong>Language(s):</strong> Indonesia
          </li>
          <li>
            <strong>License:</strong> Apache-2.0
          </li>
          <li>
            <strong>Fine-tuned from model:</strong>{" "}
            indobenchmark/indobert-base-p1
          </li>
        </ul>
      </div>
      <div className="space-y-2">
        <strong className="text-xl">Label</strong>
        <div className="space-x-2">
          <Chip color="danger" size="md" variant="flat">
            0: Negative
          </Chip>
          <Chip color="success" size="md" variant="flat">
            1: Positive
          </Chip>
        </div>
      </div>

      <div>
        <strong className="text-xl">Training Procedure</strong>

        <ul className="list-disc">
          <li>learning_rate = 3e-6</li>
          <li>Optimizer = AdamW</li>
          <li>max_seq_length = 128</li>
          <li>num_train_epochs = 3.0</li>
        </ul>
      </div>
      <div>
        <strong className="text-xl">Resources</strong>
        <div className="flex flex-col gap-2">
          <ul className="list-disc">
            <li>
              <Link
                color="foreground"
                href="https://huggingface.co/agufsamudra/indo-sentiment-analysis"
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
