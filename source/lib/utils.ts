import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  GRAPH_ALGO,
  MINIMUM_SPANNING_TREE_ALGO,
  SHORTEST_PATH_ALGO,
} from "@/app/constants";
import dijkstra from "@/app/algorthms/shortest_paths/dijkstra";
import { MarkerType } from "@xyflow/react";
import floyd from "@/app/algorthms/shortest_paths/floyd";

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

export class Matrix {
  matrix: number[][];

  constructor(matrix: number[][]) {
    this.matrix = matrix;
  }

  n() {
    return this.matrix.length;
  }

  get(i: number, j: number) {
    return this.matrix[i][j];
  }

  to_path_floyd(
    nodes: any,
    isDirected: boolean,
    source,
    onlyResult: boolean = false,
  ) {
    return { nodes, edges: [] };
  }

  to_path_dijkstra(
    nodes: any,
    isDirected: boolean,
    source: number = 0,
    onlyResult: boolean = false,
  ) {
    const { trace } = dijkstra(this.matrix, source);

    const temp = trace.reduce((acc, source, target) => {
      if (source !== -1) {
        acc.push(`e${source}${target}`);
        acc.push(`e${target}${source}`);
      }
      return acc;
    }, []) as string[];

    const edges = trace.reduce((acc, source, target) => {
      if (source !== -1) {
        acc.push({
          id: `e${source}${target}`,
          source: source.toString(),
          target: target.toString(),
          data: {
            label: this.get(source, target).toString(),
          },
          type: "floating",
          style: {
            strokeWidth: 2,
            stroke: "green",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: "green",
          },
        });
      }
      return acc;
    }, []);

    if (!onlyResult)
      edges.push(
        ...this.to_path_default(nodes, isDirected).edges.filter(
          (edge) => !temp.includes(edge.id),
        ),
      );

    console.log({ nodes, edges });
    return { nodes, edges };
  }

  to_path_default(nodes: any, isDirected: boolean) {
    const edges = this.matrix.flatMap((line, i) =>
      line
        .map((item, j) => {
          const res = {
            id: `e${i}${j}`,
            source: i.toString(),
            target: j.toString(),
            weight: this.get(i, j).toString(),
            data: {
              label: this.get(i, j).toString(),
            },
            type: "floating",
            style: {
              strokeWidth: 2,
              stroke: "black",
            },
          };
          if (isDirected) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            res.markerEnd = {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
              color: "black",
            };
          }
          return res;
        })
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

  to_path_prim() {
    return { nodes: [], edges: [] };
  }

  to_path(
    algo: GRAPH_ALGO | null,
    source?: number,
    onlyResult: boolean = false,
  ) {
    const isDirected = isDirectedMatrix(this.matrix);
    const nodes = this.matrix.map((_, i) => {
      const res = {
        id: i.toString(),
        data: { label: `${i}` },
        position: { x: 0, y: 0 },
        style: {
          borderRadius: "100%",
          backgroundColor: "#fff",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };

      if (i === source) {
        res.style = {
          ...res.style,
          backgroundColor: "red",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          color: "white",
        };
      }

      return res;
    });

    switch (algo) {
      case SHORTEST_PATH_ALGO.DIJKSTRA:
        return this.to_path_dijkstra(nodes, isDirected, source, onlyResult);
      case SHORTEST_PATH_ALGO.FLOYD:
        return this.to_path_floyd(nodes, isDirected, source, onlyResult);
      case MINIMUM_SPANNING_TREE_ALGO.PRIM:
        return this.to_path_prim();
      default:
        return this.to_path_default(nodes, isDirected);
    }
  }
}
