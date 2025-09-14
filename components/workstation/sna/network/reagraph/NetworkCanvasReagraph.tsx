"use client";

import { useAtomValue } from "jotai";
import React, { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import {
  GraphCanvas,
  darkTheme,
  lightTheme,
  Theme,
  GraphCanvasRef,
} from "reagraph";
import { useTheme } from "next-themes";
import NoNetworkReagraph from "./NoNetworkReagraph";
import { centralityData } from "@/app/lib/workstation/social/calculate/state";
import { Button } from "@heroui/button";
import { CloseActionIcon } from "@/components/icon/IconAction";
import { ReagraphData } from "@/app/lib/workstation/social/network/reagraph/state";

export type NetworkCanvasHandle = {
  fitView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

function NetworkCanvasReagraph(props: {}, ref: React.Ref<NetworkCanvasHandle>) {
  const graphData = useAtomValue(ReagraphData);
  const centralityAtom = useAtomValue(centralityData);
  const hasGraph = graphData.nodes.length > 0 && graphData.edges.length > 0;
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const baseTheme: Theme = isDark ? darkTheme : lightTheme;
  const graphRef = useRef<GraphCanvasRef | null>(null);

  // expose methods to parent
  useImperativeHandle(ref, () => ({
    fitView: () => graphRef.current?.fitNodesInView(),
    zoomIn: () => graphRef.current?.zoomIn(),
    zoomOut: () => graphRef.current?.zoomOut(),
  }));

  const customTheme: Theme = {
    ...baseTheme,
    canvas: { ...baseTheme.canvas, background: isDark ? "#18181b" : "#ffffff" },
    node: {
      ...baseTheme.node,
      fill: "#f3afda",
      activeFill: "#a7efef",
      label: {
        ...baseTheme.node?.label,
        color: isDark ? "#e5e7eb" : "#1f2937",
        activeColor: isDark ? "#ffffff" : "#000000",
      },
    },
    edge: {
      ...baseTheme.edge,
      label: {
        ...baseTheme.edge?.label,
        color: isDark ? "#9ca3af" : "#6b7280",
        activeColor: isDark ? "#f3f4f6" : "#111827",
      },
    },
    cluster: baseTheme.cluster
      ? { ...baseTheme.cluster, label: { ...baseTheme.cluster.label, color: isDark ? "#d1d5db" : "#374151" } }
      : undefined,
  };

  const sizedNodes = useMemo(() => {
    if (!hasGraph) return [];
    const nodeMap = centralityAtom?.graphData?.node_map ?? {};
    const centralityArr = centralityAtom?.graphData?.betweenness_centrality ?? [];
    if (centralityArr.length === 0) return graphData.nodes;

    const max = Math.max(...centralityArr);
    const min = Math.min(...centralityArr);

    return graphData.nodes.map((n) => {
      const entry = Object.entries(nodeMap).find(([_, id]) => id === n.id);
      const idx = entry ? Number(entry[0]) : -1;
      const centrality = idx >= 0 && idx < centralityArr.length ? centralityArr[idx] : 0;
      const norm = max === min ? 0.5 : (centrality - min) / (max - min);
      return { ...n, label: n.label ?? n.id, size: 20 + norm * 80 };
    });
  }, [graphData, centralityAtom, hasGraph]);

  return (
    <div className="relative flex-1 min-h-[600px] overflow-hidden">
      {hasGraph ? (
        <GraphCanvas
          nodes={sizedNodes}
          edges={graphData.edges}
          theme={customTheme}
          ref={graphRef}
          contextMenu={({ data, onClose }) => {
            const nodeMap = centralityAtom?.graphData?.node_map ?? {};
            const betweenness = centralityAtom?.graphData?.betweenness_centrality ?? [];
            const closeness = centralityAtom?.graphData?.closeness_centrality ?? [];
            const degree = centralityAtom?.graphData?.degree_centrality ?? [];
            const eigen = centralityAtom?.graphData?.eigenvector_centrality ?? [];
            const katz = centralityAtom?.graphData?.katz_centrality ?? [];
            const entry = Object.entries(nodeMap).find(([_, id]) => id === data.id);
            const idx = entry ? Number(entry[0]) : -1;

            return (
              <div
                className={`w-[300px] flex flex-col gap-4 rounded-md p-2 text-sm shadow-md border border-blue-500 ${
                  isDark ? "bg-gray-800 text-gray-50" : "bg-white text-gray-900"
                }`}
              >
                <div>
                  <h2 className="text-lg font-semibold">{data.label}</h2>
                  <ul className="text-md">
                    <li>Betweenness: {idx >= 0 ? betweenness[idx]?.toFixed(4) : "-"}</li>
                    <li>Closeness: {idx >= 0 ? closeness[idx]?.toFixed(4) : "-"}</li>
                    <li>Degree: {idx >= 0 ? degree[idx]?.toFixed(4) : "-"}</li>
                    <li>Eigenvector: {idx >= 0 ? eigen[idx]?.toFixed(4) : "-"}</li>
                    <li>Katz: {idx >= 0 ? katz[idx]?.toFixed(4) : "-"}</li>
                  </ul>
                </div>
                <div>
                  <Button
                    onPress={onClose}
                    color="danger"
                    variant="flat"
                    startContent={<CloseActionIcon className="w-4" />}
                  >
                    Close
                  </Button>
                </div>
              </div>
            );
          }}
        />
      ) : (
        <NoNetworkReagraph />
      )}
    </div>
  );
}


export default forwardRef(NetworkCanvasReagraph);
