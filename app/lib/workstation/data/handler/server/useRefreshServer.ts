// useRefreshWithPagination.ts
import { addToast } from "@heroui/react";
import { useGetDataServer } from "./useGetDataServer";

export function useRefreshServer(onDataFetched?: (data: any[], totalCount?: number) => void) {
  const getData = useGetDataServer();

  const refresh = async (page: number = 1) => {
    try {
      const result = await getData(page, 100);
      
      if ("Complete" in result && result.Complete.data) {
        
        if(onDataFetched) {
          onDataFetched?.(
          result.Complete.data, 
          result.Complete.total_count || 0
        );
          addToast({
          title: "Success",
          description: result.Complete.message || "Data fetched successfully",
          color: "success",
        });
        }
      } else if ("Error" in result) {
        addToast({
          title: "Error",
          description: result.Error.message || "Failed to fetch data",
          color: "danger",
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: `Refresh Failed ${error}`,
        color: "danger",
      });
    }
  };

  return { refresh };
}