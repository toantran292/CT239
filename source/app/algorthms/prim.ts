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

export function prim(graph: Array<Array<number>>) {
  const n = graph.length;
  const dist = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  const trace = Array(n).fill(-1);

  dist[0] = 0;

  for (let i = 0; i < n; i++) {
    const u = findBestU(dist, visited, n);
    visited[u] = true;

    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[u][v] !== 0 && graph[u][v] < dist[v]) {
        dist[v] = graph[u][v];
        trace[v] = u;
      }
    }
  }

  return { dist, trace };
}

// Example data
//     [ 0, 2, 0, 6, 0 ],
//     [ 2, 0, 3, 8, 5 ],
//     [ 0, 3, 0, 0, 7 ],
//     [ 6, 8, 0, 0, 9 ],
//     [ 0, 5, 7, 9, 0 ]
