"use client";

import { useRefreshGraph } from "@/app/lib/workstation/social/network/reagraph/useRefresh";
import { useGetEdges } from "@/app/lib/workstation/social/network/useGetNetwork";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";
import { Button } from "@heroui/react";

export default function NetworkEmptyViewer() {
<<<<<<< HEAD:components/sna/network/NetworkEmptyViewer.tsx
  const handleRefreshGraph = useRefreshGraph();
=======
 
  const handleRefreshGraph = useRefreshGraph();
  
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/network/NetworkEmptyViewer.tsx

  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <div className="flex items-center gap-2">
<<<<<<< HEAD:components/sna/network/NetworkEmptyViewer.tsx
        <Button
          variant="flat"
          isDisabled
          startContent={<InfoIconSolid />}
          color="warning"
        >
=======
        <Button variant="flat" isDisabled startContent={<InfoIconSolid />} color="warning">
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/network/NetworkEmptyViewer.tsx
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
