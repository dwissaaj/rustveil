import { Tabs, Tab } from "@heroui/react";

import NetworkHome from "./network/NetworkHome";
import VerticesHome from "./centrality/CentralityHome";

import SocialFilterListWrapper from "@/components/workstation/sna/SocialFilterListWrapper";

export default function SocialNetwork() {
  return (
    <div className="">
      <div>
        <SocialFilterListWrapper />
      </div>
      <div className="mt-4">
        <Tabs
          size="lg"
          aria-label="Social Tab"
          color="primary"
          variant="underlined"
        >
          <Tab key="network" title="Network">
            <NetworkHome />
          </Tab>
          <Tab key="centrality" title="Centrality">
            <VerticesHome />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
