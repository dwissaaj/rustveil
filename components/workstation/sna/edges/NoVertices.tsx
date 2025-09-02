import { Code } from "@heroui/code";

export default function NoVerticesSelected() {
  return (
    <div className="mt-20 flex flex-row items-center justify-center">
      <Code color="warning">No Vertex Selected - try to pick</Code>
    </div>
  );
}
