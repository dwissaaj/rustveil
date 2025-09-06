// useTransform.ts
import { NetworkGraphType, NetworkNodeType, NetworkLinkType } from "./state"

export interface Edge {
  source: string;
  target: string;
}

export function transformEdgesToGraph(data?: Edge[]): NetworkGraphType {
  if (!data || data.length === 0) return { nodes: [], links: [] }

  const nodesMap = new Map<string, NetworkNodeType>()
  const links: NetworkLinkType[] = []

  for (const { source, target } of data) {
    if (!nodesMap.has(source)) {
      nodesMap.set(source, { id: source, height: 1, size: 24, color: 'rgb(97, 205, 187)' })
    }
    if (!nodesMap.has(target)) {
      nodesMap.set(target, { id: target, height: 1, size: 24, color: 'rgb(97, 205, 187)' })
    }
    links.push({ source, target, distance: 80 })
  }
  console.log(nodesMap)
  console.log(links)
  return { nodes: Array.from(nodesMap.values()), links }
}
