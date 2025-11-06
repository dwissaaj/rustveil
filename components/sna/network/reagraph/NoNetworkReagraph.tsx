"use client";

import { GetReagraph } from "@/app/lib/workstation/social/network/reagraph/useGetReagraph";
import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { useGetEdges } from "@/app/lib/workstation/social/network/useGetNetwork";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";
import { addToast, Button } from "@heroui/react";

<<<<<<< HEAD:components/sna/network/reagraph/NoNetworkReagraph.tsx
export default function NoNetworkReagraph() {
  const handleRefreshGraph = useRefreshGraph();

=======

export default function NoNetworkReagraph() {
  const handleRefreshGraph = useRefreshGraph();

  
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/network/reagraph/NoNetworkReagraph.tsx
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
