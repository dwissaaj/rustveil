"use client";

import { CentralityKey, selectedCentrality, selectedChart } from "@/app/lib/workstation/social/centrality/state";
import { Button, Select, SelectItem } from "@heroui/react";
import { RefreshIcon } from "@/components/icon/IconView";
import { useAtom } from "jotai";
import { useState } from "react";

export default function CentralitySelectGraph() {
  const [chart, setChart] = useAtom(selectedChart);
  const [centrality, setCentrality] = useAtom(selectedCentrality);

  // local state for centrality before refreshing
  const [pendingCentrality, setPendingCentrality] = useState<CentralityKey>(centrality);

  return (
    <div className="flex flex-row gap-6">
      <Select
        label="Select Chart Type"
        selectedKeys={new Set([chart])}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as "pie" | "bar";
          setChart(value);
        }}
        variant="underlined"
        placeholder="Targeted Chart"
        color="primary"
      >
        <SelectItem key="pie">Pie</SelectItem>
        <SelectItem key="bar">Bar</SelectItem>
      </Select>

      <Select
        label="Select Centrality"
        selectedKeys={new Set([pendingCentrality])}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as CentralityKey;
          setPendingCentrality(value); // update local only
        }}
        variant="underlined"
        placeholder="Centrality Value"
      >
        <SelectItem key="betweenness_centrality">Betweenness</SelectItem>
        <SelectItem key="degree_centrality">Degree</SelectItem>
        <SelectItem key="eigenvector_centrality">Eigenvector</SelectItem>
        <SelectItem key="katz_centrality">Katz</SelectItem>
        <SelectItem key="closeness_centrality">Closeness</SelectItem>
      </Select>

      <Button
        isIconOnly
        startContent={<RefreshIcon className="w-6" />}
        onPress={() => {
          setCentrality(pendingCentrality); // apply only when refresh is clicked
        }}
      />
    </div>
  );
}
