"use client";

import { Button, Select, SelectItem } from "@heroui/react";
import { useAtom } from "jotai";
import { useState } from "react";

import { RefreshIcon } from "@/components/icon/IconView";
import {
  CentralityKey,
  selectedCentrality,
  selectedChart,
} from "@/app/lib/workstation/social/centrality/state";

export default function CentralitySelectGraph() {
  const [chart, setChart] = useAtom(selectedChart);
  const [centrality, setCentrality] = useAtom(selectedCentrality);

  const [pendingCentrality, setPendingCentrality] =
    useState<CentralityKey>(centrality);

  return (
    <div className="flex flex-row items-center justify-center gap-6">
      <Select
        color="primary"
        label="Select Chart Type"
        placeholder="Targeted Chart"
        selectedKeys={new Set([chart])}
        variant="underlined"
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as "pie" | "bar";

          setChart(value);
        }}
      >
        <SelectItem key="pie">Pie</SelectItem>
        <SelectItem key="bar">Bar</SelectItem>
      </Select>

      <Select
        label="Select Centrality"
        placeholder="Centrality Value"
        selectedKeys={new Set([pendingCentrality])}
        variant="underlined"
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as CentralityKey;

          setPendingCentrality(value);
        }}
      >
        <SelectItem key="betweenness_centrality">Betweenness</SelectItem>
        <SelectItem key="degree_centrality">Degree</SelectItem>
        <SelectItem key="eigenvector_centrality">Eigenvector</SelectItem>
        <SelectItem key="katz_centrality">Katz</SelectItem>
        <SelectItem key="closeness_centrality">Closeness</SelectItem>
      </Select>

      <Button
        isIconOnly
        color="primary"
        startContent={<RefreshIcon className="w-6" />}
        variant="light"
        onPress={() => {
          setCentrality(pendingCentrality);
        }}
      />
    </div>
  );
}
