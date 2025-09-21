import { invoke } from "@tauri-apps/api/core";

import { InvokeResponse } from "@/app/lib/data/response";

export function useGetDataServer() {
  const getDataServer = async (page: number = 1, pageSize: number = 100) => {
    try {
      const response = await invoke<InvokeResponse>("get_paginated_data", {
        pagination: {
          page: page,
          page_size: pageSize,
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  return getDataServer;
}
