"use client";

import { useAtomValue } from "jotai";
import { ResponsiveNetwork } from "@nivo/network";
import { NetworkGraphData } from "@/app/lib/workstation/social/network/state";
import { useTheme } from "next-themes";
import NetworkEmptyViewer from "./NetworkEmptyViewer";
import { centralityData } from "@/app/lib/workstation/social/calculate/state";

export default function NetworkGraphViewer() {
  const graph = useAtomValue(NetworkGraphData);
  const centralityAtom = useAtomValue(centralityData);
  const { theme } = useTheme();

  if (!graph || graph.nodes.length === 0) {
    return <NetworkEmptyViewer />;
  }

  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const axisColor = theme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";

  const NodeTooltip = ({ node }: { node: any }) => {
    const centralityArr =
      centralityAtom?.graphData?.betweenness_centrality ?? [];
    const nodeMap = centralityAtom?.graphData?.node_map ?? {};

    const entry = Object.entries(nodeMap).find(([_, id]) => id === node.id);
    const idx = entry ? Number(entry[0]) : -1;

    const realCentrality =
      idx >= 0 && idx < centralityArr.length ? centralityArr[idx] : 0;

    return (
      <div
        style={{
          background: tooltipBackgroundColor,
          padding: "8px 12px",
          borderRadius: "4px",
          color: tooltipTextColor,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          fontSize: "14px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              background: node.color,
              marginRight: "8px",
              borderRadius: "50%",
            }}
          />
          <strong>{node.id}</strong>
        </div>

        <div>Centrality: {realCentrality}</div>
      </div>
    );
  };

  const nodes = graph.nodes.map((n) => ({
    ...n,
    size: Math.max(1, n.size),
  }));

  const nodeIds = new Set(nodes.map((n) => n.id));
  const links = graph.links
    .filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target))
    .map((l) => ({ ...l }));

  const data = { nodes, links };

  return (
    <div style={{ height: 600 }}>
      <ResponsiveNetwork
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        linkDistance={(l) => l.distance}
        nodeSize={(n) => n.size}
        activeNodeSize={(n) => 1.5 * n.size}
        nodeColor={(n) => n.color}
        linkThickness={() => 2}
        linkBlendMode="normal"
        nodeTooltip={NodeTooltip}
        theme={{
          labels: {
            text: {
              fill: textColor,
            },
          },
          axis: {
            domain: {
              line: {
                stroke: axisColor,
              },
            },
            ticks: {
              line: {
                stroke: axisColor,
              },
              text: {
                fill: textColor,
              },
            },
            legend: {
              text: {
                fill: textColor,
              },
            },
          },
          grid: {
            line: {
              stroke: gridColor,
              strokeWidth: 1,
            },
          },
          tooltip: {
            container: {
              background: tooltipBackgroundColor,
              color: tooltipTextColor,
              fontSize: 12,
              borderRadius: 4,
            },
          },
        }}
      />
    </div>
  );
}
