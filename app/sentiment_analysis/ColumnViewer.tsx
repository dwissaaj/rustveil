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
import { useAtom, useAtomValue } from "jotai";

import { useGetSentimentDataTarget } from "../lib/sentiment_analysis/useGetSentimentData";
import { RefreshIcon } from "@/components/icon/IconView";
import {
  columnTargetSentimentAnalysis,
  sentimentCountData,
  sentimentData,
  sentimentViewerPage,
} from "../lib/sentiment_analysis/state";

export default function ColumnViewerTable() {
  const targetColumn = useAtomValue(columnTargetSentimentAnalysis);
  const getTargetData = useGetSentimentDataTarget();

  const [data, setData] = useAtom(sentimentData);
  const [page, setPage] = useAtom(sentimentViewerPage);
  const [, setTotalCountData] = useAtom(sentimentCountData);
  const [totalCount, setTotalCount] = useState(0);

  const rowsPerPage = 100;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const fetchData = async (showToast: boolean = false) => {
    if (!targetColumn) {
      setData([]);
      setTotalCount(0);
      setTotalCountData({
        total_count: 0,
        total_negative_data: 0,
        total_positive_data: 0,
      });
    }

    try {
      const response = await getTargetData(page, rowsPerPage);

      if (response?.response_code === 200 && response.data) {
        setData(response.data);
        setTotalCount(response.total_count ?? 0);
        setTotalCountData({
          total_count: response.total_count ?? 0,
          total_negative_data: response.total_negative_data ?? 0,
          total_positive_data: response.total_positive_data ?? 0,
        });
        if (showToast) {
          addToast({
            title: "Data Fetched",
            description: `${response?.message}`,
            variant: "bordered",
            color: "success",
          });
        }
      } else if (response?.response_code !== 200) {
        setData([]);
        setTotalCount(0);
        setTotalCountData({
          total_count: 0,
          total_negative_data: 0,
          total_positive_data: 0,
        });
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

  useEffect(() => {
    fetchData(false);
  }, [page, targetColumn]);

  return (
    <div className="flex flex-col gap-4 p-2">
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
          <TableColumn>Polarity</TableColumn>
          <TableColumn>Score</TableColumn>
        </TableHeader>

        <TableBody emptyContent={"No Data Available, Target > Pick A Column"}>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
              <TableCell>{row[targetColumn] ?? "—"}</TableCell>
              <TableCell>{row.polarity ?? "—"}</TableCell>
              <TableCell>
                {typeof row.score === "number"
                  ? row.score.toFixed(3)
                  : (row.score ?? "—")}
              </TableCell>
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
