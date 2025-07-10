// useMapProgress.ts
import { listen } from "@tauri-apps/api/event";
import { useState, useEffect } from "react";

export type MappingProgress = {
  progress: number;
  message: string;
  isError: boolean;
};

export const useMapProgress = () => {
  const [progress, setProgress] = useState<MappingProgress | null>(null);

  useEffect(() => {
    const unlistenPromise = listen<MappingProgress>(
      "mapping-progress",
      (event) => {
        setProgress(event.payload);
        console.log("Progress update:", event.payload); // Debug log
      },
    );

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return progress;
};
