import { ConnectionLineComponentProps, getBezierPath } from "@xyflow/react";
import { getEdgeParams } from "@/lib/edges.util";

function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
  toNode,
}: ConnectionLineComponentProps): JSX.Element | null {
  if (!fromNode) {
    return null;
  }

  if (!toNode) {
    return null;
  }
  const { sx, sy } = getEdgeParams(fromNode, toNode);
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path fill="none" stroke="#222" strokeWidth={1.5} d={edgePath} />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default FloatingConnectionLine;
