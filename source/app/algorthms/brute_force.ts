export function tspBruteForce(graph: number[][], startNode: number = 0) {
  const n = graph.length;

  // Arrays to store the result nodes and edges
  const nodes: any[] = [];
  const edges: any[] = [];

  // Helper function to recursively build the tree
  function buildTree(
    path: number[],
    visited: Set<number>,
    currentCost: number,
  ) {
    const currentNode = path[path.length - 1];
    const nodeId = `${path.join("->")}`; // Unique identifier for this state

    // Add the current node to the nodes array
    nodes.push({
      id: nodeId,
      node: currentNode,
      path: [...path],
      cost: currentCost,
      isLeaf: path.length === n + 1,
    });

    // If all nodes are visited, return to the start node
    if (path.length === n + 1) {
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

        // Add the edge to the edges array
        edges.push({
          from: nodeId,
          to: childId,
          cost: graph[currentNode][nextNode],
        });

        // Recursively build the tree for the child
        buildTree(newPath, newVisited, newCost);
      }
    }

    // If all nodes are visited, return to the start node
    if (path.length === n) {
      const returnCost = graph[currentNode][startNode];
      const newPath = [...path, startNode];
      const newCost = currentCost + returnCost;

      const childId = `${newPath.join("->")}`;

      // Add the edge to return to the starting node
      edges.push({
        from: nodeId,
        to: childId,
        cost: returnCost,
      });

      // Add the final node
      nodes.push({
        id: childId,
        node: startNode,
        path: newPath,
        cost: newCost,
        isLeaf: true,
      });
    }
  }

  // Start building the tree from the starting node
  const visited = new Set<number>();
  visited.add(startNode);
  buildTree([startNode], visited, 0);

  return { nodes, edges };
}

//  [0, 10, 15, 20],
//   [10, 0, 35, 25],
//   [15, 35, 0, 30],
//   [20, 25, 30, 0],
