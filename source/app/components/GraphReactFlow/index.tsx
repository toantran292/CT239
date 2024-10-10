import { ReactFlow } from "@xyflow/react";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function GraphReactFlow() {
  return (
    <div
      className="flex-col flex-1 h-screen border-2 px-3"
      // style={{ width: "100vw", height: "50vh" }}
    >
      <div className="border-b-2 mb-3">ĐỒ THỊ</div>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
}
