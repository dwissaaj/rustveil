"use client";

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { useAtom } from "jotai";
import { useGetDataByColumn } from "@/app/lib/workstation/data/handler/useGetDataByColumn";
import { columnTargetSentimentAnalysis } from "@/app/lib/workstation/data/state";

export default function ColumnViewerTable() {
  const [targetColumn] = useAtom(columnTargetSentimentAnalysis);
  const columnValues = useGetDataByColumn(targetColumn);

  if (!targetColumn) {
    return <p className="text-gray-500">No column selected</p>;
  }

  if (!columnValues || columnValues.length === 0) {
    return <p className="text-gray-500">No data available</p>;
  }

  return (
    <Table aria-label="Column viewer table" isStriped>
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>{targetColumn}</TableColumn>
      </TableHeader>
      <TableBody>
        {columnValues.map((val, idx) => (
          <TableRow key={idx}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{val ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
