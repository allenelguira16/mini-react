export function onNodeReattached(callback: () => void, $node: Node) {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Check for added nodes
      for (const node of mutation.addedNodes) {
        if (node === $node) {
          observer.disconnect();
          callback();
          break;
        }
      }
    }
  });

  queueMicrotask(() => {
    if (!$node.parentNode) {
      return;
    }

    observer.observe($node.parentNode, { childList: true, subtree: true });
  });
}
