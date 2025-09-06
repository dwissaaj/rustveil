"use client";

import { useAtomValue } from "jotai";
import { ResponsiveNetwork } from "@nivo/network";
import { NetworkGraphData } from "@/app/lib/workstation/social/edges/state";

export default function EdgesGraphNetwork() {
  const graph = useAtomValue(NetworkGraphData);
 
  if (!graph || graph.nodes.length === 0) {
    return <div>No data to render yet.</div>;
  }

  // Keep your nodes/links as-is from your atom
  const nodes = graph.nodes.map(n => ({
    ...n,
  }));

  const nodeIds = new Set(nodes.map(n => n.id));
  const links = graph.links
    .filter(l => nodeIds.has(l.source) && nodeIds.has(l.target))
    .map(l => ({
      ...l,
    }));

  const data = { nodes, links };

  return (
    <div style={{ height: 600 }}>
      <ResponsiveNetwork
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        linkDistance={l => l.distance}       // use your distance property
        nodeSize={n => n.size}               // use your size property
        activeNodeSize={n => 1.5 * n.size}   // optional
        nodeColor={n => n.color}             // use your color property
        linkThickness={l => 2}               // or use l.target.height if you want
        linkBlendMode="multiply"
      />
    </div>
  );
}
