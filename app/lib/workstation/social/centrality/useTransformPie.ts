import { CalculateCentralityType } from "../calculate/state";

export function useTransformToPieData(
  graphData: CalculateCentralityType,
  centralityKey: keyof Omit<CalculateCentralityType, "node_map">
) {
  const nodes = graphData.node_map ?? {};
  const values = graphData[centralityKey] ?? [];

  return values.map((value, index) => ({
    id: nodes[index] ?? `Node ${index}`,
    label: nodes[index] ?? `Node ${index}`,
    value,
  }));
}
