"use client";

import { Button } from "@heroui/react";

import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";

export default function NoNetworkReagraph() {
  const handleRefreshGraph = useRefreshGraph();

  return (
    <div className="flex flex-row flex-1 h-[500px] w-full items-center justify-center gap-4">
      <Button
        isDisabled
        color="warning"
        startContent={<InfoIconSolid />}
        variant="flat"
      >
        Calculate Centrality First to show Graph
      </Button>

      <Button
        isIconOnly
        color="warning"
        startContent={<RefreshIcon className="w-6" />}
        variant="light"
        onPress={handleRefreshGraph}
      />
    </div>
  );
}
