import { addToast } from "@heroui/react";
<<<<<<< HEAD

=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
import { GetReagraph } from "./useGetReagraph";

export function useRefreshGraph() {
  const fetchEdges = GetReagraph();
  const handleRefreshGraph = async () => {
    try {
      const result = await fetchEdges();
<<<<<<< HEAD

=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
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
