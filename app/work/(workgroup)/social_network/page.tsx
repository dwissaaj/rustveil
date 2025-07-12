import SocialFilterListWrapper from "@/components/workstation/sna/SocialFilterListWrapper";
import React from "react";

import { Tabs, Tab } from "@heroui/react";
import EdgesHome from "./edges/EdgesHome";
import VerticesHome from "./vertices/VerticesHome";
export default function SocialNetwork() {
  return (
    <div className="">
      <div>
        <SocialFilterListWrapper />
      </div>
      <div className="mt-4">
        <Tabs variant="underlined" color="primary" aria-label="Options">
          <Tab key="edges" title="Edges">
            <EdgesHome />
          </Tab>
          <Tab key="vertices" title="Vertices">
            <VerticesHome />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
