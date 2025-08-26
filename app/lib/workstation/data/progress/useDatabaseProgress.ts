// useMapProgress.ts
import { listen } from "@tauri-apps/api/event";
import { useState, useEffect } from "react";

export type DatabaseProgress = {
  total_rows: number;
  count: number;
};

export const useDatabaseProgress = () => {
  const [progress, setProgress] = useState<DatabaseProgress | null>(null);

  useEffect(() => {
    const unlistenPromise = listen<DatabaseProgress>(
      "database-insert-progress",
      (event) => {
        setProgress(event.payload);
      },
    );

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return progress;
};
