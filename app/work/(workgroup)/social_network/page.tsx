import { Tabs, Tab } from "@heroui/react";


import SocialFilterListWrapper from "@/components/sna/SocialFilterListWrapper";
import NetworkHome from "@/app/social_network/network/NetworkHome";
import ChartHome from "@/app/social_network/centrality/ChartHome";

export default function SocialNetwork() {
  return (
    <div className="">
      <div>
        <SocialFilterListWrapper />
      </div>
      <div className="mt-4">
        <Tabs
          aria-label="Social Tab"
          color="primary"
          size="lg"
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
