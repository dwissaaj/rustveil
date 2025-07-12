import { useAtomValue } from "jotai";
import React from "react";
import EdgesTableViewer from "@/components/workstation/sna/edges/EdgesTableViewer";
import EdgesGraph from "./EdgesGraph";
import EdgesTable from "./EdgesTable";
import { Select, SelectItem, Chip } from "@heroui/react";
import { useGraphData } from "@/app/lib/workstation/social/useGraphData";
import {  useNetworkData, useNivoLinks, useNivoNodes } from "@/app/lib/workstation/nivo/NivoNetworkFormat";
import { EdgesGraphNetwork } from "@/components/workstation/sna/edges/EdgesGraphNetwork";
export default function EdgesHome() {
  const { headers, vertex1, setVertex1, vertex2, setVertex2 ,data, edgesValue, centralityValueData, vertex1Data, vertex2Data} = useGraphData();
  const datas = useNetworkData()
  console.log(datas)

  return (
    <div className="max-h-screen">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-1/2 gap-4 space-y-6">
          <div className="flex flex-row gap-4 ">
            <Select
              label="Vertex 1"
              selectedKeys={vertex1 ? [vertex1] : []}
              onSelectionChange={(keys) =>
                setVertex1(Array.from(keys)[0] as string)
              }
            >
              {headers.map((header) => (
                <SelectItem key={header}>{header}</SelectItem>
              ))}
            </Select>

            <Select
              label="Vertex 2"
              selectedKeys={vertex2 ? [vertex2] : []}
              onSelectionChange={(keys) =>
                setVertex2(Array.from(keys)[0] as string)
              }
            >
              {headers.map((header) => (
                <SelectItem key={header}>{header}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-row gap-2 mb-4">
            {vertex1 && <Chip color="primary">{vertex1}</Chip>}
            {vertex2 && <Chip color="secondary">{vertex2}</Chip>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <EdgesTable />
        </div>
        <div>
          < EdgesGraphNetwork />
        </div>
      </div>
    </div>
  );
}
