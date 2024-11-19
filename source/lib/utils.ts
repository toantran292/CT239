import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ALGORITHMS, TOPICS } from "@/app/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Matrix = number[][];

export const checkAlgorithms = (matrix: Matrix): Record<string, string[]> => {
  const n = matrix.length;

  let hasNegativeWeights = false;
  let hasNegativeWeightCycles = false;
  let isDirected = false;
  let hasInfinity = false;

  // Check matrix properties
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] < 0) hasNegativeWeights = true;
      if (matrix[i][j] === Infinity) hasInfinity = true;
      if (matrix[i][j] !== matrix[j][i]) isDirected = true;
    }
  }

  // Check for negative weight cycles using Floyd-Warshall
  const dist = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      i === j ? 0 : matrix[i][j] || Infinity,
    ),
  );

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (dist[i][i] < 0) {
      hasNegativeWeightCycles = true;
      break;
    }
  }

  const applicableAlgorithms: Record<string, string[]> = {
    [TOPICS.SHORTEST_PATH]: [],
    [TOPICS.TSP]: [],
    [TOPICS.MINIMUM_SPANNING_TREE]: [],
  };

  // Shortest Path
  if (!hasNegativeWeights) {
    applicableAlgorithms[TOPICS.SHORTEST_PATH].push(ALGORITHMS.DIJKSTRA);
  }
  if (!hasNegativeWeightCycles) {
    applicableAlgorithms[TOPICS.SHORTEST_PATH].push(ALGORITHMS.FLOYD);
  }

  // TSP
  if (!hasInfinity) {
    applicableAlgorithms[TOPICS.TSP].push(ALGORITHMS.BRUTE_FORCE);
    applicableAlgorithms[TOPICS.TSP].push(ALGORITHMS.BRANCH_AND_BOUND);
  }

  // Minimum Spanning Tree
  if (!isDirected) {
    applicableAlgorithms[TOPICS.MINIMUM_SPANNING_TREE].push(ALGORITHMS.KRUSKAL);
    if (!hasNegativeWeights) {
      applicableAlgorithms[TOPICS.MINIMUM_SPANNING_TREE].push(ALGORITHMS.PRIM);
    }
  }

  return applicableAlgorithms;
};
