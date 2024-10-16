import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { number } from "prop-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDirectedMatrix(matrix: number[][]): boolean {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== matrix[j][i]) {
        return true;
      }
    }
  }
  return false;
}

export function matrix2node_edge(matrix: Array<Array<number>>) {
  const isDirected = isDirectedMatrix(matrix);
  const nodes = matrix.map((_, i) => ({
    id: i.toString(),
    data: { label: `node ${i}` },
    position: { x: 0, y: 0 },
  }));

  const edges = matrix.flatMap((line, i) =>
    line
      .map((item, j) => ({
        id: `e${i}${j}`,
        source: i.toString(),
        target: j.toString(),
        weight: matrix[i][j].toString(),
        type: "smoothstep",
        label: matrix[i][j].toString(),
        // animated: true,
      }))
      .filter((edge) => {
        return (
          edge.source !== edge.target &&
          edge.weight !== "0" &&
          (isDirected || edge.source < edge.target)
        );
      }),
  );

  return { nodes, edges };
}
