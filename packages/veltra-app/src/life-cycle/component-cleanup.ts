const cleanupMap = new Map<Node, (() => void)[]>();

/**
 * set the component cleanup
 *
 * @param node - The node.
 * @param cleanups - The cleanups.
 */
export function setComponentCleanup(node: Node, cleanups: (() => void)[]) {
  cleanupMap.set(node, cleanups);
}

/**
 * run the component cleanup
 *
 * @param node - The node.
 */
export function runComponentCleanup(node: Node) {
  const cleanups = cleanupMap.get(node) || [];
  for (const cleanup of cleanups) {
    cleanup();
  }
}
