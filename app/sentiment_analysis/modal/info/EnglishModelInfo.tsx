import { useAtomValue } from "jotai";
import Image from "next/image";
import { Chip } from "@heroui/react";
import Link from "next/link";

import {
  columnTargetSentimentAnalysis,
  selectedLang,
} from "../../../lib/sentiment_analysis/state";

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
          src="/model/distillbert-sst.png"
          width={500}
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
                href="https://huggingface.co/docs/transformers/main/en/model_doc/distilbert#transformers.DistilBertForSequenceClassification"
                rel="noopener noreferrer"
                target="_blank"
              >
                Model Documentation
              </Link>
            </li>

            <li>
              <Link
                color="foreground"
                href="https://arxiv.org/abs/1910.01108"
                rel="noopener noreferrer"
                target="_blank"
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
