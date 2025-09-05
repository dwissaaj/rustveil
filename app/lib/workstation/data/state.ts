import { atom } from "jotai";
import {
  CentralityTableData,
  NetworkGraphDataType,
  NetworkNodeLinkType,
  NetworkNodeType,
  TableDataType,
  UserNode,
} from "./dto";

// need to deleted since we not ising jotai atom
export const tableData = atom<TableDataType | null>(null);

// get all sheets from the file
export const sheetAvailable = atom<string[]>([]);

// single selected sheet to load
export const sheetSelected = atom<string>("");

export const filePath = atom<{
  isSelected: boolean;
  url: string;
}>({
  isSelected: false, // Default: no file selected
  url: "", // Default: empty string
});

export const loadDatabase = atom<{
  isSelected: boolean;
  url: string;
}>({
  isSelected: false, // Default: no file selected
  url: "", // Default: empty string
});

// stores current page data
export const dataTable = atom<any[]>([]);
// loading state
export const loadingTable = atom(false);
// total count for pagination
export const totalCountTable = atom(0);
// current page
export const currentPageTable = atom(1);

export const columnAvailable = atom<string[]>([]);

export const vertex1ColumnSelected = atom<string>("");
export const vertex2ColumnSelected = atom<string>("");
export const vertexGraphTypeSelected = atom<string>("direct");

export const vertex1ColumnData = atom<string[]>([]);
export const vertex2ColumnData = atom<string[]>([]);


export const edgesGraphValue = atom<Record<number, number>>();
export const centralityData = atom<CentralityTableData[]>([]);
export const NodesNetworkNodes = atom<NetworkNodeType[]>();
export const NodesNetworkLink = atom<NetworkNodeLinkType[]>();
