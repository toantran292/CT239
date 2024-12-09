import { ALGORITHMS, ALGORITHMS_BY_TOPIC, TOPICS } from "@/app/constants";
import { MarkerType } from "@xyflow/react";
import {
  dijkstra,
  floyd,
  kruskal,
  prim,
  tspBranchAndBound,
  tspBruteForce,
} from "@/app/algorthms";

export const NEEDS_SOURCE = [TOPICS.SHORTEST_PATH];
export const ALGO_NEEDS_SOURCE = NEEDS_SOURCE.flatMap(
  (topic) => ALGORITHMS_BY_TOPIC[topic],
);
export const buildNode = (i: number, meta: any = {}) => {
  return {
    id: String(i),
    data: { label: meta.label || String(i) },
    position: { x: 0, y: 0 },
    style: {
      borderRadius: meta.style?.borderRadius || "100%",
      backgroundColor: "#fff",
      width: meta.style?.width || 30,
      minHeight: meta.style?.minHeight || 30,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "black",
    },
  };
};

export const buildEdge = (
  source: number,
  target: number,
  label: string,
  isDirected: boolean,
  color: string = "black",
) => {
  return {
    id: `e:${source}-${target}`,
    source: String(source),
    target: String(target),
    weight: label,
    data: {
      label,
    },
    type: "floating",
    style: {
      strokeWidth: 2,
      stroke: color,
    },
    markerEnd: !isDirected
      ? null
      : {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: color,
        },
  };
};

export const getResultGraphByDijkstra = (mat: number[][], source: number) => {
  const { trace } = dijkstra(mat, source);

  return trace.reduce((acc, source, target) => {
    if (source !== -1) {
      acc.push(
        buildEdge(source, target, String(mat[source][target]), true, "green"),
      );
    }
    return acc;
  }, []);
};
export const getResultGraphByFloyd = (mat: number[][], source: number) => {
  const { trace } = floyd(mat);

  const edges = [];
  for (let target = 0; target < trace[source].length; target++) {
    if (trace[source][target] !== -1 && source !== target) {
      edges.push(
        buildEdge(
          trace[source][target], // Predecessor of the target
          target, // Target node
          String(mat[trace[source][target]][target]), // Weight of the edge
          true, // Directed flag
          "green", // Color
        ),
      );
    }
  }

  return edges;
};
export const getResultGraphByKruskal = (mat: number[][]) => {
  const { mstEdges } = kruskal(mat);

  return mstEdges.reduce((acc: any, { u, v, weight }) => {
    acc.push(buildEdge(u, v, String(weight), false, "green"));
    return acc;
  }, []);
};
export const getResultGraphByPrim = (mat: number[][]) => {
  const { trace } = prim(mat);

  return trace.reduce((acc, source, target) => {
    if (source !== -1) {
      acc.push(
        buildEdge(source, target, String(mat[source][target]), false, "green"),
      );
    }
    return acc;
  }, []);
};
export const getResultGraphByBruteForce = (mat: number[][]) => {
  const { nodes: resultNodes, edges: resultEdges } = tspBruteForce(mat);

  const minCost = resultNodes.reduce((acc, value) => {
    if (!value.isLeaf) return acc;
    return Math.min(acc, value.cost);
  }, Infinity);

  const nodes = resultNodes.map((value, i) => {
    const res = {
      id: String(value.id),
      type: "tree",
      data: {
        label: `TT: ${i + 1} | TGT: ${value.cost}`,
        path: value.isLeaf ? value.id : null,
        style: {
          backgroundColor: "#fff",
          width: 150,
          minHeight: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
        },
      },
      position: { x: 0, y: 0 },
    };

    if (value.isLeaf && value.cost === minCost) {
      res.data.style.backgroundColor = "green";
      res.data.style.color = "white";
    }
    return res;
  });

  const edges = resultEdges.map((value) => {
    return buildEdge(
      value.from,
      value.to,
      `${value.to[value.to.length - 1]} - [${value.cost}]`,
      true,
      "green",
    );
  });

  console.log({ resultNodes, resultEdges });

  return { nodes, edges };
};
export const getResultGraphByBranchAndBound = (mat: number[][]) => {
  const {
    nodes: resultNodes,
    edges: resultEdges,
    bestCost: minCost,
  } = tspBranchAndBound(mat);

  const nodes = resultNodes.map((value: any, i: number) => {
    const res = {
      id: String(value.id),
      type: "tree",
      data: {
        label: `TT: ${i + 1} | TGT: ${value.cost}`,
        path: value.isLeaf ? value.id : null,
        bound: value.bound,
        style: {
          backgroundColor: "#fff",
          width: 150,
          minHeight: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
        },
      },
      position: { x: 0, y: 0 },
    };

    if (value.isLeaf && value.cost === minCost) {
      res.data.style.backgroundColor = "green";
      res.data.style.color = "white";
    }

    if (value.pruned) {
      res.data.style.backgroundColor = "red";
      res.data.style.color = "white";
    }

    return res;
  });

  const edges = resultEdges.map((value: any) => {
    return buildEdge(
      value.from,
      value.to,
      `${value.to[value.to.length - 1]} - [${value.cost}]`,
      true,
      "green",
    );
  });

  console.log({ resultNodes, resultEdges });

  return { nodes, edges };
};

export const getResultGraph = (
  algorithm: ALGORITHMS,
  mat: number[][],
  source?: number,
): { nodes: any[]; edges: any; error: string | null | undefined } => {
  if (ALGO_NEEDS_SOURCE.includes(algorithm)) {
    if (source === undefined)
      return { nodes: [], edges: [], error: "Không được để trống đỉnh nguồn" };

    if (source < 0 || source >= Math.max(mat.length, mat[0].length))
      return {
        nodes: [],
        edges: [],
        error: `Đỉnh nguồn không tồn tại [0, ${Math.max(mat.length, mat[0].length) - 1}]`,
      };
  }

  let nodes = mat.map((_, i) => {
    const res = buildNode(i);

    if (source !== undefined) {
      if (
        i === source &&
        !ALGORITHMS_BY_TOPIC[TOPICS.MINIMUM_SPANNING_TREE].includes(algorithm)
      ) {
        res.style.backgroundColor = "red";
        res.style.color = "white";
      }
    }

    return res;
  });

  let edges: any = [];
  let error = null;

  switch (algorithm) {
    case ALGORITHMS.DIJKSTRA:
      edges = getResultGraphByDijkstra(mat, source!);
      break;
    case ALGORITHMS.FLOYD:
      edges = getResultGraphByFloyd(mat, source!);
      break;
    case ALGORITHMS.KRUSKAL:
      edges = getResultGraphByKruskal(mat);
      break;
    case ALGORITHMS.PRIM:
      edges = getResultGraphByPrim(mat);
      break;
    case ALGORITHMS.BRUTE_FORCE:
      const resultBF = getResultGraphByBruteForce(mat);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      nodes = resultBF.nodes;
      edges = resultBF.edges;
      break;
    case ALGORITHMS.BRANCH_AND_BOUND:
      const resultBaB = getResultGraphByBranchAndBound(mat);
      nodes = resultBaB.nodes;
      edges = resultBaB.edges;
      break;
    default:
      error = "Thuật toán không tồn tại";
      break;
  }

  console.log({ nodes, edges });

  return { nodes, edges, error };
};
