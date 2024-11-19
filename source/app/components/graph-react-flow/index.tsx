import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { useEffect } from "react";

import FloatingEdge from "@/components/react-flows/edges/FloatingEdge";
import FloatingConnectionLine from "@/components/react-flows/edges/FloatingConnectionLine";
import { useGraph } from "../graph-input";
import TreeNode from "@/components/react-flows/nodes/TreeNode";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any, edges: any, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const edgeTypes = {
  floating: FloatingEdge,
};

const nodeTypes = {
  tree: TreeNode,
};

const Flow = () => {
  const { resultGraph } = useGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      resultGraph.nodes,
      resultGraph.edges,
      "LR",
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [resultGraph, setEdges, setNodes]);

  return (
    <ReactFlow
      className="floatingedges"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionLineComponent={FloatingConnectionLine}
      edgesFocusable={false}
      nodesFocusable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};

export const GraphReactFlow = () => {
  const { matrix } = useGraph();

  if (!matrix) return null;

  return <Flow />;
};
