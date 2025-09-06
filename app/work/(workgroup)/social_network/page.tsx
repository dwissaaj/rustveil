import { Tabs, Tab } from "@heroui/react";

import EdgesHome from "./edges/EdgesHome";
import VerticesHome from "./vertices/VerticesHome";

import SocialFilterListWrapper from "@/components/workstation/sna/SocialFilterListWrapper";

export default function SocialNetwork() {
  return (
    <div className="">
      <div>
        <SocialFilterListWrapper />
      </div>
      <div className="mt-4">
        <Tabs aria-label="Social Tab" color="primary" variant="underlined">
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
