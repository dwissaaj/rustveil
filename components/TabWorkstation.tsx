"use client";
import React from "react";
import { Tab, Tabs } from "@heroui/react";
import Data from "@/app/work/(workgroup)/data/page";
import NamedEntityRecognition from "@/app/work/(workgroup)/ner/page";
import SentimentAnalysis from "@/app/work/(workgroup)/sentiment/page";
import TopicClassification from "@/app/work/(workgroup)/topic_classification/page";
import TopicModelling from "@/app/work/(workgroup)/topicm/page";
import RelationExtraction from "@/app/work/(workgroup)/relation_extraction/page";
import SocialNetwork from "@/app/work/(workgroup)/social_network/page";

export default function TabWorkstation() {
  return (
    <Tabs
      size="lg"
      radius="full"
      variant="light"
      color="primary"
      aria-label="Options"
      className="border-b p-2"
      disabledKeys={["Relation Extraction", "Topic Classification"]}
    >

      <Tab key="Data" title="Data">
        <Data />
      </Tab>
      <Tab key="Social Network" title="Social Network">
        <SocialNetwork />
      </Tab>
            <Tab key="Sentiment Analysis" title="Sentiment Analysis">
        <SentimentAnalysis />
      </Tab>
      <Tab key="NER" title="NER">
        <NamedEntityRecognition />
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
  );
}
