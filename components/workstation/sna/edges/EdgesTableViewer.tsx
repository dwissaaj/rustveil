import { centralityData } from "@/app/lib/workstation/social/edges/state";
import { RefreshIcon } from "@/components/icon/IconView";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Pagination,
  Button,
  addToast,
} from "@heroui/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useAsyncList } from "@react-stately/data";
import NoVerticesSelected from "./NoCentralityTable";
import { useGetCentrality } from "@/app/lib/workstation/social/calculate/useGetCentrality";

export default function CentralityTable() {
  const getCentrality = useGetCentrality();
  const [isLoading, setIsLoading] = useState(false);
  const graphDataState = useAtomValue(centralityData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  const g = graphDataState?.graphData;

  const rows = g
    ? Object.entries(g.node_map ?? {}).map(([id, label]) => {
        const idx = parseInt(id, 10);
        return {
          id: idx,
          label,
          degree: g.degree_centrality?.[idx] ?? 0,
          betweenness: g.betweenness_centrality?.[idx] ?? 0,
          closeness: g.closeness_centrality?.[idx] ?? 0,
          eigenvector: g.eigenvector_centrality?.[idx] ?? 0,
          katz: g.katz_centrality?.[idx] ?? 0,
        };
      })
    : [];

  // 🔹 useAsyncList for sorting
  let list = useAsyncList({
    async load() {
      return { items: rows };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: [...items].sort((a, b) => {
          let first = a[sortDescriptor.column as keyof typeof a];
          let second = b[sortDescriptor.column as keyof typeof b];

          let cmp = 0;
          if (first < second) cmp = -1;
          if (first > second) cmp = 1;
          if (sortDescriptor.direction === "descending") cmp *= -1;

          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    list.setSelectedKeys(new Set());
    list.reload();
  }, [graphDataState]);

  const totalPages = Math.ceil(list.items.length / pageSize);
  const startRow = (currentPage - 1) * pageSize;
  const pagedRows = list.items.slice(startRow, startRow + pageSize);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getCentrality();
      if (response?.response_code === 200) {
        addToast({
          title: "Success",
          description: `${response.message}`,
          color: "success",
        });
      } else {
        addToast({
          title: "Error at Fetch",
          description: `${response?.message}`,
          color: "danger",
        });
      }
    } catch (err) {
      console.error("Centrality load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label="Centrality table"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        isHeaderSticky
        isVirtualized
        isStriped
        bottomContent={
          rows.length > 0 && (
            <div className="text-sm text-default-500">
              Showing {pagedRows.length} of {rows.length} records (Page{" "}
              {currentPage} of {totalPages})
            </div>
          )
        }
        bottomContentPlacement="outside"
        topContent={
          <Button
            variant="light"
            onPress={loadData}
            className="m-2"
            isIconOnly
            startContent={<RefreshIcon className="w-4" />}
          />
        }
      >
        <TableHeader>
          <TableColumn className="bg-primary text-white">Number</TableColumn>
          <TableColumn className="bg-primary text-white">Node</TableColumn>
          <TableColumn
            key="degree"
            allowsSorting
            className="bg-primary text-white"
          >
            Degree
          </TableColumn>
          <TableColumn
            key="betweenness"
            allowsSorting
            className="bg-primary text-white"
          >
            Betweenness
          </TableColumn>
          <TableColumn
            key="closeness"
            allowsSorting
            className="bg-primary text-white"
          >
            Closeness
          </TableColumn>
          <TableColumn
            key="eigenvector"
            allowsSorting
            className="bg-primary text-white"
          >
            Eigenvector
          </TableColumn>
          <TableColumn
            key="katz"
            allowsSorting
            className="bg-primary text-white"
          >
            Katz
          </TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          items={pagedRows}
          loadingContent={<CircularProgress size="lg" color="secondary" />}
          emptyContent={<NoVerticesSelected />}
        >
          {(row) => (
            <TableRow key={row.id}>
              <TableCell>{startRow + list.items.indexOf(row) + 1}</TableCell>
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.degree}</TableCell>
              <TableCell>{row.betweenness}</TableCell>
              <TableCell>{row.closeness}</TableCell>
              <TableCell>{row.eigenvector}</TableCell>
              <TableCell>{row.katz}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            color="secondary"
            showControls
          />
        </div>
      )}
    </div>
  );
}
