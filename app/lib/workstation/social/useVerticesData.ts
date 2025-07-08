/**
 * Custom hook for managing vertex column selection and data
 *
 * @hook
 * @example
 * const { headers, vertex1, setVertex1, vertex2, setVertex2, vertex1Data, vertex2Data } = useVerticesData();
 *
 * @description
 * Provides centralized state management for:
 * - Available table headers
 * - Vertex column selections
 * - Filtered vertex data
 *
 * @state
 * - Reads from tableData atom
 * - Manages vertex1ColumnSelected and vertex2ColumnSelected atoms
 *
 * @returns {
 *   headers: string[],
 *   vertex1: string,
 *   setVertex1: (value: string) => void,
 *   vertex1Data: any[],
 *   vertex2: string,
 *   setVertex2: (value: string) => void,
 *   vertex2Data: any[],
 *   graphType: string,
 *   setGraphType: (value: string) => void,
 * }
 *
 * @behavior
 * - Returns empty array if no column selected
 * - Automatically updates derived data when selections change
 * - Handles null/undefined table data safely
 *
 * @dependencies
 * - Jotai state management
 * - tableData structure must contain headers and rows
 */
"use client";
import { useAtomValue, useAtom } from "jotai";
import {
  centralityGraphValue,
  edgesGraphValue,
  tableData,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
} from "../data/state";



export const useVerticesData = () => {
  const data = useAtomValue(tableData);
  const [vertex1, setVertex1] = useAtom(vertex1ColumnSelected);
  const [vertex2, setVertex2] = useAtom(vertex2ColumnSelected);
  const [graphType, setGraphType] = useAtom(vertexGraphTypeSelected);
  const [centralityValue, setcentralityValue] = useAtom(centralityGraphValue);
  const [edgesValue, setedgesValue] = useAtom(edgesGraphValue);


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
    setedgesValue
  };
};
