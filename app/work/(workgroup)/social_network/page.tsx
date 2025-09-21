import { Tabs, Tab } from "@heroui/react";



import SocialFilterListWrapper from "@/components/sna/SocialFilterListWrapper";

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
          
          </Tab>
          <Tab key="centrality" title="Chart">

          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
