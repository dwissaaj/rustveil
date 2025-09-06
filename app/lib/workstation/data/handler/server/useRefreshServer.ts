import { addToast } from "@heroui/react";
import { useRef } from "react";

import { useGetDataServer } from "./useGetDataServer";

export function useRefreshServer(
  onDataFetched?: (data: any[], totalCount?: number) => void,
) {
  const getData = useGetDataServer();
  const lastToastRef = useRef(false);

  const refresh = async (page: number = 1) => {
    try {
      const result = await getData(page, 100);

      if ("Success" in result && result.Success.data) {
        if (onDataFetched) {
          onDataFetched(result.Success.data, result.Success.total_count || 0);
        }

        if (!lastToastRef.current) {
          addToast({
            title: "Success",
            description: result.Success.message || "Data fetched successfully",
            color: "success",
          });
          lastToastRef.current = true; // mark as shown
        }
      } else if ("Error" in result) {
        addToast({
          title: "Error",
          description: result.Error.message || "Failed to fetch data",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: `Refresh Failed ${error}`,
        color: "danger",
      });
    }
  };

  return { refresh };
}
