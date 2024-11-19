export function tspBranchAndBound(graph: number[][], startNode: number = 0) {
  const n = graph.length;

  // Arrays to store the result nodes and edges
  const nodes: any = [];
  const edges: any = [];

  let bestCost = Infinity; // Keep track of the best (minimum) cost
  let bestPath = null;

  // Helper to calculate the lower bound for a given path
  function calculateBound(
    path: number[],
    visited: Set<number>,
    currentCost: number,
  ): number {
    let bound = currentCost;

    // Add the minimum outgoing edge cost for unvisited nodes
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        let minEdgeCost = Infinity;
        for (let j = 0; j < n; j++) {
          if (i !== j && !visited.has(j) && graph[i][j] !== 0) {
            minEdgeCost = Math.min(minEdgeCost, graph[i][j]);
          }
        }
        bound += minEdgeCost === Infinity ? 0 : minEdgeCost;
      }
    }

    return bound;
  }

  // Recursive function to explore the state tree
  function branchAndBound(
    path: number[],
    visited: Set<number>,
    currentCost: number,
  ) {
    const currentNode = path[path.length - 1];
    const nodeId = `${path.join("->")}`; // Unique identifier for this state

    // Compute the lower bound for the current path
    const bound = calculateBound(path, visited, currentCost);

    // Create a node object
    const node = {
      id: nodeId,
      node: currentNode,
      path: [...path],
      cost: currentCost,
      bound,
      pruned: false, // Default: not pruned
      isLeaf: path.length === n + 1,
    };

    // Prune the branch if its bound exceeds the best known cost
    if (bound >= bestCost) {
      node.pruned = true;
      nodes.push(node); // Add pruned node to the result
      return;
    }

    // Add the current node to the result nodes
    nodes.push(node);

    // If we've visited all nodes and returned to the start node
    if (path.length === n) {
      const returnCost = graph[currentNode][startNode];
      const totalCost = currentCost + returnCost;

      // Update best solution if this path is better
      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestPath = [...path, startNode];
      }

      // Add the return edge to the result edges
      const childId = `${path.join("->")}->${startNode}`;
      edges.push({
        from: nodeId,
        to: childId,
        cost: returnCost,
      });

      // Add the return node
      nodes.push({
        id: childId,
        node: startNode,
        path: [...path, startNode],
        cost: totalCost,
        bound: 0,
        pruned: false,
        isLeaf: true,
      });

      return;
    }

    // Explore all unvisited nodes
    for (let nextNode = 0; nextNode < n; nextNode++) {
      if (!visited.has(nextNode) && graph[currentNode][nextNode] !== 0) {
        const newVisited = new Set(visited);
        newVisited.add(nextNode);
        const newPath = [...path, nextNode];
        const newCost = currentCost + graph[currentNode][nextNode];

        const childId = `${newPath.join("->")}`;

        // Add the edge to the result edges
        edges.push({
          from: nodeId,
          to: childId,
          cost: graph[currentNode][nextNode],
        });

        // Recursively explore the next node
        branchAndBound(newPath, newVisited, newCost);
      }
    }
  }

  // Start the algorithm from the starting node
  const visited = new Set<number>();
  visited.add(startNode);
  branchAndBound([startNode], visited, 0);

  return { nodes, edges, bestCost, bestPath };
}
