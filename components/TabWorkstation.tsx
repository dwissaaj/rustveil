"use client";
import React from "react";
import { Tab, Tabs } from "@heroui/react";


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

      </Tab>
      <Tab key="Social Network" title="Social Network">
     
      </Tab>
            <Tab key="Sentiment Analysis" title="Sentiment Analysis">

      </Tab>
      <Tab key="NER" title="NER">
       
      </Tab>


      <Tab key="Topic Modelling" title="Topic Modelling">

      </Tab>
      <Tab key="Topic Classification" title="Topic Classification">

      </Tab>
      <Tab key="Relation Extraction" title="Relation Extraction">

      </Tab>
    </Tabs>
  );
}
