import { addToast } from "@heroui/react";
import { useGetAllData } from "./useGetAllData";


export function useRefresh(onDataFetched?: (data: any[]) => void) {
  const getData = useGetAllData();

  const refresh = async () => {
    try {
      const result = await getData();

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
      addToast({
        title: "Error",
        description: `Refresh failed ${error}`,
        color: "danger",
      });
    }
  };

  return { refresh };
}
