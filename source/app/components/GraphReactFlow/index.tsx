import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { useEffect } from "react";

import FloatingEdge from "@/app/components/GraphReactFlow/edges/FloatingEdge";
import FloatingConnectionLine from "@/app/components/GraphReactFlow/edges/FloatingConnectionLine";

import { Matrix } from "@/lib/utils";
import useGraph from "@/app/hooks/useGraph";
import useMatrixInput from "@/app/hooks/useMatrixInput";
import useShortestPath from "@/app/hooks/useShortestPath";

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

const changeSourceElements = (nodes: any, source: number) => {
  const newNodes = nodes.map((node: any) => {
    const res = {
      ...node,
      style: { ...node.style, backgroundColor: "white", color: "black" },
    };

    if (node.id === source.toString()) {
      res.style = {
        ...res.style,
        backgroundColor: "red",
        color: "white",
      };
    }
    return res;
  });

  return { nodes: newNodes };
};

const edgeTypes = {
  floating: FloatingEdge,
};

const Flow = () => {
  const { matrix } = useMatrixInput();
  const { source, onlyResult } = useShortestPath();
  const { selectedAlgo } = useGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = new Matrix(
      matrix,
    ).to_path(selectedAlgo, source, onlyResult);
    const { nodes: layoutedNodes } = getLayoutedElements(
      initialNodes,
      initialEdges,
      "LR",
    );
    setNodes([...layoutedNodes]);
    // setEdges([...initialEdges]);
  }, [matrix]);

  useEffect(() => {
    const { edges: initialEdges } = new Matrix(matrix).to_path(
      selectedAlgo,
      source,
      onlyResult,
    );
    const { nodes: changedNodes } = changeSourceElements(nodes, source);
    setEdges([...initialEdges]);
    setNodes([...changedNodes]);
  }, [onlyResult, selectedAlgo, setEdges, source]);

  return (
    <ReactFlow
      className="floatingedges"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
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

export default function GraphReactFlow() {
  const { matrix } = useMatrixInput();

  if (!matrix) return null;

  return <Flow />;
}
