"use client";

import { Button } from "@heroui/react";

import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";

export default function NetworkEmptyViewer() {
  const handleRefreshGraph = useRefreshGraph();

  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <div className="flex items-center gap-2">
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
    </div>
  );
}
