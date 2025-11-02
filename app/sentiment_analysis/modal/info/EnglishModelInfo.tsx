import { useAtomValue } from "jotai";
import Image from "next/image";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";
import { Chip } from "@heroui/react";

import Link from "next/link";
import { LanguageIcon, ColumnFilterOutline } from "@/components/icon/IconSA";

export default function EnglishModelInfo() {
  const selectedLanguage = useAtomValue(selectedLang);

  const columnTarget = useAtomValue(columnTargetSentimentAnalysis);
  return (
    <div className="p-2 space-y-4">
      <div className="space-y-4">
        <div>
          <strong>
            Distillbert/distilbert-base-uncased-finetuned-sst-2-english
          </strong>
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
          src="/model/distillbert-sst.png"
          alt="English Model"
          width={500}
          height={150}
          className="rounded-lg shadow"
        />
      </div>
      <div>
        <strong className="text-xl">Description</strong>
        <p>
          his model is a fine-tune checkpoint of DistilBERT-base-uncased,
          fine-tuned on SST-2. This model reaches an accuracy of 91.3 on the dev
          set (for comparison, Bert bert-base-uncased version reaches an
          accuracy of 92.7).
        </p>
      </div>
      <div className="">
        <strong className="text-xl">Model Details</strong>
        <ul className="list-disc">
          <li>
            <strong>Developed by:</strong> Hugging Face
          </li>
          <li>
            <strong>Model Type:</strong> Text Classification
          </li>
          <li>
            <strong>Language(s):</strong> English
          </li>
          <li>
            <strong>License:</strong> Apache-2.0
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
          <li>learning_rate = 1e-5</li>
          <li>batch_size = 32</li>
          <li>warmup = 600</li>
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
                href="https://huggingface.co/docs/transformers/main/en/model_doc/distilbert#transformers.DistilBertForSequenceClassification"
              >
                Model Documentation
              </Link>
            </li>

            <li>
              <Link
                color="foreground"
                rel="noopener noreferrer"
                target="_blank"
                href="https://arxiv.org/abs/1910.01108"
              >
                DistilBERT paper
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
