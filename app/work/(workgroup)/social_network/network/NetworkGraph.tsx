"use client";

import NetworkGraphViewer from "@/components/workstation/sna/network/NetworkGraphViewer";

export default function NetworkGraph() {
  return (
    <div className="w-full h-full bg-content1 shadow-md border-1 dark:border-0 rounded-lg">
      <NetworkGraphViewer />
    </div>
  );
}
