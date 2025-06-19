const cleanupMap = new Map<Node, (() => void)[]>();

export function registerComponentCleanup(node: Node, cleanups: (() => void)[]) {
  cleanupMap.set(node, cleanups);
}

export function runComponentCleanup($node: Node) {
  const cleanups = cleanupMap.get($node) || [];
  for (const cleanup of cleanups) {
    cleanup();
  }
}
