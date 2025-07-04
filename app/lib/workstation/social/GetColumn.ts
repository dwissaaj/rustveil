/**
 * Custom hook for managing vertex column selection and data
 *
 * @hook
 * @example
 * const { headers, vertex1, setVertex1, vertex2, setVertex2, vertex1Data, vertex2Data } = useColumnShow();
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
 *   vertex2Data: any[]
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
  tableData,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
} from "../data/state";



export const useColumnShow = () => {
  const data = useAtomValue(tableData);
  const [vertex1, setVertex1] = useAtom(vertex1ColumnSelected);
  const [vertex2, setVertex2] = useAtom(vertex2ColumnSelected);

  // Get column data directly
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
  };
};
