export type TableCell = string | number | boolean | null;

export interface TableDataType {
  headers: string[];
  rows: Record<string, TableCell>[];
  status?: number;
  error?: string;
}

export interface RustTsConnection {
  headers: string[];
  rows: Record<string, TableCell>[];
  status?: number;
  error?: string;
}
