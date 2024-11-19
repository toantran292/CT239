export function floyd(graph: number[][]) {
  const n = graph.length;
  const dist = Array.from(Array(n), () => new Array(n).fill(0));
  const trace = Array.from(Array(n), () => new Array(n).fill(-1));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (graph[i][j] == 0) dist[i][j] = Infinity;
      else dist[i][j] = graph[i][j];
      if (graph[i][j] !== 0 && i !== j) {
        trace[i][j] = i;
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          trace[i][j] = trace[k][j];
        }
      }
    }
  }
  return { dist, trace };
}
