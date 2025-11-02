import { useAtomValue } from "jotai";
import Image from "next/image";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";
import { Chip } from "@heroui/react";

import { LanguageIcon, ColumnFilterOutline } from "@/components/icon/IconSA";
import Link from "next/link";

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
          src="/model/indo-sentiment-analysis.png"
          alt="English Model"
          width={500}
          height={150}
          className="rounded-lg shadow"
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
          <Chip variant="flat" color="danger" size="md">
            0: Negative
          </Chip>
          <Chip variant="flat" color="success" size="md">
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
                rel="noopener noreferrer"
                target="_blank"
                href="https://huggingface.co/agufsamudra/indo-sentiment-analysis"
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
