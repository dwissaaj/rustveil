// useRefreshData.ts
import { addToast } from "@heroui/react";
import { useGetAllData } from "@/app/lib/workstation/data/handler/useGetAllData";

export function useRefresh(onDataFetched?: (data: any[]) => void) {
  const getData = useGetAllData();

  const refresh = async () => {
    try {
      const result = await getData();
      console.log(result);

      if (result?.response_code === 200 && result.data) {
        onDataFetched?.(result.data);
        addToast({
          title: "Success",
          description: `${result.message}`,
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
      console.error(error);
      addToast({
        title: "Error",
        description: "Refresh failed",
        color: "danger",
      });
    }
  };

  return { refresh };
}
