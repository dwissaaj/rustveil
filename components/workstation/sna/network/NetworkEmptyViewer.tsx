"use client";

import { useGetEdges } from "@/app/lib/workstation/social/network/useGetNetwork";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";
import { addToast, Button } from "@heroui/react";

export default function NetworkEmptyViewer() {
  const transformNivo = useGetEdges();

  const handleRefresh = async () => {
    try {
      const result = await transformNivo();
      if (result?.response_code === 200) {
        addToast({
          title: "Success",
          description: result.message,
          color: "success",
        });
      } else {
        addToast({
          title: "Error at Fetch",
          description: `${result?.message}`,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: `${error}`,
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <div className="flex items-center gap-2">
        <Button variant="flat" isDisabled startContent={<InfoIconSolid />} color="warning">
          Calculate Centrality First to show Graph
        </Button>

        <Button
          onPress={handleRefresh}
          variant="light"
          startContent={<RefreshIcon className="w-6" />}
          isIconOnly
          color="warning"
        />
      </div>
    </div>
  );
}
