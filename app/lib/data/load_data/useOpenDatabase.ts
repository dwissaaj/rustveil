import { invoke } from "@tauri-apps/api/core";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  filePath,
  targetVerticesCreatedAt,
  vertex1ColumnSelected,
  vertex2ColumnSelected,
  vertexGraphTypeSelected,
} from "../state";
import { InvokeResponse } from "../response";
import {
  columnTargetSentimentAnalysis,
  selectedLang,
  targetSentimentCreatedAt,
} from "../../sentiment_analysis/state";

export function useOpenDatabase() {
  const pathfile = useAtomValue(filePath);
  const setVertex1 = useSetAtom(vertex1ColumnSelected);
  const setVertex2 = useSetAtom(vertex2ColumnSelected);
  const setGraphType = useSetAtom(vertexGraphTypeSelected);
  const setTargetVerticesCreatedAt = useSetAtom(targetVerticesCreatedAt);
  const setTargetSentimentCreatedAt = useSetAtom(targetSentimentCreatedAt);
  const setLanguageTarget = useSetAtom(selectedLang);
  const setSentimentTarget = useSetAtom(columnTargetSentimentAnalysis);
  const loadTable = async () => {
    try {
      const response = await invoke<InvokeResponse>("load_sqlite_data", {
        pathfile: pathfile.url,
      });
      console.log(response);
      if ("Success" in response) {
        setVertex1(response.Success.target_vertex_1 || "");
        setVertex2(response.Success.target_vertex_2 || "");
        setGraphType(response.Success.graph_type || "");
        setTargetVerticesCreatedAt(
          response.Success.target_social_network_updatedat || ""
        );
        setTargetSentimentCreatedAt(
          response.Success.target_sentiment_analysis_updatedat || ""
        );
        setLanguageTarget(response.Success.target_sentiment_column || "");
        setSentimentTarget(response.Success.target_sentiment_column || "");
        return {
          response_code: response.Success.response_code,
          message: response.Success.message,
          data: response.Success.data,
          total_count: response.Success.total_count,
        };
      } else if ("Error" in response) {
        return {
          response_code: response.Error.response_code,
          message: response.Error.message,
        };
      }
    } catch (error: any) {
      return {
        response_code: 500,
        message: `Error loading table data ${error}`,
      };
    }
  };

  return loadTable;
}
