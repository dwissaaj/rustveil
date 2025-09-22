"use client";

import { GetReagraph } from "@/app/lib/workstation/social/network/reagraph/useGetReagraph";
import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { useGetEdges } from "@/app/lib/workstation/social/network/useGetNetwork";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";
import { addToast, Button } from "@heroui/react";

export default function NoNetworkReagraph() {
  const handleRefreshGraph = useRefreshGraph();

  return (
    <div className="flex flex-row flex-1 h-[500px] w-full items-center justify-center gap-4">
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
  );
}
