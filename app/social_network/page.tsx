"use client";
import { Tabs, Tab } from "@heroui/react";
import NetworkHome from "./network/NetworkHome";
import ChartHome from "./centrality/ChartHome";
import SocialFilterListWrapper from "@/components/sna/SocialFilterListWrapper";

export default function page() {
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
          <Tab key="centrality" title="Chart">
            <ChartHome />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
