"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  addToast,
} from "@heroui/react";
import { useAtomValue } from "jotai";

import { useGetSentimentDataTarget } from "../lib/sentiment_analysis/useGetSentimentData";
import { RefreshIcon } from "@/components/icon/IconView";
import { columnTargetSentimentAnalysis } from "./state";


export default function ColumnViewerTable() {
  const targetColumn = useAtomValue(columnTargetSentimentAnalysis);
  const getTargetData = useGetSentimentDataTarget();

  const [data, setData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const rowsPerPage = 100;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const fetchData = async (showToast: boolean = false) => {
    if (!targetColumn) {
      setData([]);
      setTotalCount(0);
      return;
    }

    try {
      const response = await getTargetData(page, rowsPerPage);

      if (response?.response_code === 200 && response.data) {
        setData(response.data);
        setTotalCount(response.total_count ?? 0);

        if (showToast) {
          addToast({
            title: "Data Fetched",
            description: `Data Rendered ${response?.message}`,
            variant: "bordered",
            color: "success",
          });
        }
      } else if (response?.response_code !== 200) {
        setData([]);
        setTotalCount(0);

        if (showToast) {
          addToast({
            title: "Error Fetching",
            description: `${response?.message}`,
            variant: "bordered",
            color: "danger",
          });
        }
      }
    } catch (err) {
      setData([]);
      setTotalCount(0);

      if (showToast) {
        addToast({
          title: "Error at fetching",
          description: `Render Failed ${err}`,
          variant: "bordered",
          color: "danger",
        });
      }
    }
  };

  // fetch data automatically when page or target column changes, no toast
  useEffect(() => {
    fetchData(false);
  }, [page, targetColumn]);

  return (
    <div className="flex flex-col gap-4">
      <Table
        className=""
        isHeaderSticky
        isStriped
        isVirtualized
        aria-label="Dynamic data table"
        bottomContent={
          totalCount > 0 && (
            <div className="text-sm">
              Showing {data.length} of {totalCount} records (Page {page} of{" "}
              {totalPages})
            </div>
          )
        }
        bottomContentPlacement="outside"
        topContent={
          <Button
            isIconOnly
            className="m-2"
            color="primary"
            startContent={<RefreshIcon className="w-6" />}
            variant="light"
            onPress={() => fetchData(true)}
          />
        }
      >
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>{targetColumn}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No Data Available, Target > Pick A Column"}>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
              <TableCell>{row[targetColumn] ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            showControls
            color="secondary"
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
