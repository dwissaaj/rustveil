"use client";

import { GetReagraph } from "@/app/lib/workstation/social/network/reagraph/useGetReagraph";
import { useGetEdges } from "@/app/lib/workstation/social/network/useGetNetwork";
import { InfoIconSolid, RefreshIcon } from "@/components/icon/IconView";
import { addToast, Button } from "@heroui/react";


export default function NoNetworkReagraph() {
  const fetchEdges = GetReagraph();

  const handleRefresh = async () => {
    try {
      const result = await fetchEdges();
      console.log(result)
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
    <div className="flex flex-col flex-1 h-full w-full items-center justify-center gap-4">
      <Button
        variant="flat"
        isDisabled
        startContent={<InfoIconSolid />}
        color="warning"
      >
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
  );
}
