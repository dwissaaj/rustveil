"use client";

import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { useGetEdges } from "@/app/lib/workstation/social/network/useGetNetwork";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";
import { Button } from "@heroui/react";

export default function NetworkEmptyViewer() {
  const handleRefreshGraph = useRefreshGraph();

  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <div className="flex items-center gap-2">
        <Button
          variant="flat"
          isDisabled
          startContent={<InfoIconSolid />}
          color="warning"
        >
          Calculate Centrality First to show Graph
        </Button>

        <Button
          onPress={handleRefreshGraph}
          variant="light"
          startContent={<RefreshIcon className="w-6" />}
          isIconOnly
          color="warning"
        />
      </div>
    </div>
  );
}
