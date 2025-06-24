"use client";
import React from "react";
import { Button, Tab, Tabs, Switch, Card, CardBody } from "@heroui/react";
import Data from "@/app/work/(workgroup)/data/page";
import NamedEntityRecognition from "@/app/work/(workgroup)/ner/page";
import SentimentAnalysis from "@/app/work/(workgroup)/sentiment/page";
import TopicClassification from "@/app/work/(workgroup)/topic_classification/page";
import TopicModelling from "@/app/work/(workgroup)/topicm/page";
import RelationExtraction from "@/app/work/(workgroup)/relation_extraction/page";
import SocialNetwork from "@/app/work/(workgroup)/social_network/page";
export default function TabWorkstation() {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        size="lg"
        radius="full"
        variant="light"
        color="primary"
        aria-label="Options"
        className="border-b  p-2 bg-black/80 shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]"
        disabledKeys={["Relation Extraction", "Topic Classification"]}
      >
        <Tab key="Data" title="Data">
          <Data />
        </Tab>
        <Tab key="Social Network" title="Social Network">
          <SocialNetwork />
        </Tab>
        <Tab key="NER" title="NER">
          <NamedEntityRecognition />
        </Tab>
        <Tab key="Sentiment Analysis" title="Sentiment Analysis">
          <SentimentAnalysis />
        </Tab>

        <Tab key="Topic Modelling" title="Topic Modelling">
          <TopicModelling />
        </Tab>
        <Tab key="Topic Classification" title="Topic Classification">
          <TopicClassification />
        </Tab>
        <Tab key="Relation Extraction" title="Relation Extraction">
          <RelationExtraction />
        </Tab>
      </Tabs>
    </div>
  );
}
