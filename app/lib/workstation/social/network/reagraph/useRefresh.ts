import { addToast } from "@heroui/react";
import { GetReagraph } from "./useGetReagraph";

export function useRefreshGraph() {
  const fetchEdges = GetReagraph();
  const handleRefreshGraph = async () => {
    try {
      const result = await fetchEdges();
      if (result?.response_code === 200) {
        addToast({
          title: "Success",
          description: result.message,
          color: "success",
        });
      } else {
        addToast({
          title: "Error at Fetch Graph",
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

  return handleRefreshGraph;
}
