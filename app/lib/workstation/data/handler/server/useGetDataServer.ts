// useGetPaginatedData.ts
import { invoke } from "@tauri-apps/api/core";
import { InvokeResponse } from "@/app/lib/workstation/data/response";

export function useGetDataServer() {
  const getDataServer = async (page: number = 1, pageSize: number = 100) => {
    try {
      const response = await invoke<InvokeResponse>("get_paginated_data", {
        pagination: {
          page: page,
          page_size: pageSize,
        }
      });
      console.log("Response from get_paginated_data:", response);
      return response;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  };

  return getDataServer;
}