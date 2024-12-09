function findBestU(cost: number[], visited: boolean[], n: number) {
  let uBest = 0;
  let _min = Infinity;
  for (let u = 0; u < n; u++) {
    if (!visited[u] && cost[u] < _min) {
      uBest = u;
      _min = cost[u];
    }
  }

  return uBest;
}

export function dijkstra(graph: Array<Array<number>>, source: number) {
  const n = graph.length;
  const dist = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  const trace = Array(n).fill(-1);

  dist[source] = 0;

  for (let i = 0; i < n; i++) {
    const u = findBestU(dist, visited, n);
    visited[u] = true;

    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[u][v] !== 0 && dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
        trace[v] = u;
      }
    }
  }

  return { dist, trace };
}
// Example usage:
//     [0, 1, 4, 0, 0, 0],
//     [1, 0, 4, 2, 7, 0],
//     [4, 4, 0, 3, 5, 0],
//     [0, 2, 3, 0, 4, 6],
//     [0, 7, 5, 4, 0, 7],
//     [0, 0, 0, 6, 7, 0],
