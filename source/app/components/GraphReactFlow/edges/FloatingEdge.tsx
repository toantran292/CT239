import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getStraightPath,
  useInternalNode,
} from "@xyflow/react";

import { FC } from "react";
import { getEdgeParams } from "@/lib/edges.util";

type FloatingEdge = Edge<{
  id: string;
  source: string;
  target: string;
  markerEnd: string;
  style: object;
  label: string;
}>;

const FloatingEdge: FC<EdgeProps<FloatingEdge>> = ({
  id,
  source,
  target,
  style,
  data,
  markerEnd,
}) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={style}
        markerEnd={markerEnd}
        label={data?.label}
        labelX={labelX}
        labelY={labelY}
      />
    </>
  );
};

export default FloatingEdge;
