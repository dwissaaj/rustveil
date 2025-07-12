"use client";
import { useAtomValue, useAtom } from "jotai";
import {
  edgesGraphValue,
  centralityData,
  tableData,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
} from "../data/state";

export const useGraphData = () => {
  const data = useAtomValue(tableData);
  const [vertex1, setVertex1] = useAtom(vertex1ColumnSelected);
  const [vertex2, setVertex2] = useAtom(vertex2ColumnSelected);
  const [graphType, setGraphType] = useAtom(vertexGraphTypeSelected);
  const [edgesValue, setedgesValue] = useAtom(edgesGraphValue);
  const [centralityValueData, setcentralityValueData] = useAtom(centralityData);
  const getColumnData = (columnName: string) => {
    if (!columnName || !data) return [];
    return data.rows.map((row) => row[columnName]);
  };

  return {
    data,
    headers: data?.headers || [],
    vertex1,
    setVertex1,
    vertex1Data: getColumnData(vertex1),
    vertex2,
    setVertex2,
    vertex2Data: getColumnData(vertex2),
    graphType,
    setGraphType,
    edgesValue,
    setedgesValue,
    centralityValueData,
    setcentralityValueData,
  };
};
