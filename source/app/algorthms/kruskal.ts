function findRoot(parent: number[], u: number): number {
  if (parent[u] === u) return u;

  return (parent[u] = findRoot(parent, parent[u]));
}

function union(parent: number[], u: number, v: number): void {
  const rootU = findRoot(parent, u);
  const rootV = findRoot(parent, v);
  parent[rootV] = rootU;
}

// Kruskal's algorithm implementation
export function kruskal(graph: Array<Array<number>>) {
  const n = graph.length;

  // Convert the adjacency matrix to an edge list
  const edges: { u: number; v: number; weight: number }[] = [];
  for (let u = 0; u < n; u++) {
    for (let v = u + 1; v < n; v++) {
      if (graph[u][v] !== 0) {
        edges.push({ u, v, weight: graph[u][v] });
      }
    }
  }

  edges.sort((a, b) => a.weight - b.weight);

  const parent = Array.from({ length: n }, (_, i) => i);

  const mstEdges = [];

  let cost = 0;

  for (const { u, v, weight } of edges) {
    if (findRoot(parent, u) !== findRoot(parent, v)) {
      union(parent, u, v);
      mstEdges.push({ u, v, weight });
      cost += weight;
    }
  }

  return { cost, mstEdges };
}
