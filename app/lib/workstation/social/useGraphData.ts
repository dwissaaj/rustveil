"use client";
import { useAtomValue, useAtom } from "jotai";
import {
  centralityGraphValue,
  edgesGraphValue,
  graphTable,
  nodesMap,
  tableData,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
  vertices,
} from "../data/state";

export const useGraphData = () => {
  const data = useAtomValue(tableData);
  const [vertex1, setVertex1] = useAtom(vertex1ColumnSelected);
  const [vertex2, setVertex2] = useAtom(vertex2ColumnSelected);
  const [graphType, setGraphType] = useAtom(vertexGraphTypeSelected);
  const [centralityValue, setcentralityValue] = useAtom(centralityGraphValue);
  const [edgesValue, setedgesValue] = useAtom(edgesGraphValue);
  const [nodeMapValue, setnodeMap] = useAtom(nodesMap);
  const [verticesUser, setverticesValue] = useAtom(vertices);
  const [graphData, setgraphData] = useAtom(graphTable);
  const getColumnData = (columnName: string) => {
    if (!columnName || !data) return [];
    return data.rows.map((row) => row[columnName]);
  };

  return {
    headers: data?.headers || [],
    vertex1,
    setVertex1,
    vertex1Data: getColumnData(vertex1),
    vertex2,
    setVertex2,
    vertex2Data: getColumnData(vertex2),
    graphType,
    setGraphType,
    centralityValue,
    setcentralityValue,
    edgesValue,
    setedgesValue,
    nodeMapValue,
    setnodeMap,
    verticesUser,
    setverticesValue,
    graphData,
    setgraphData,
  };
};
