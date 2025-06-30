/**
 * observe a node and call a callback when it is reattached
 *
 * @param callback - The callback to call when the node is reattached.
 * @param targetNode - The node to observe.
 */
export function onNodeReattached(callback: () => void, targetNode: Node) {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Check for added nodes
      for (const node of mutation.addedNodes) {
        if (node === targetNode) {
          callback();
          break;
        }
      }
    }
  });

  queueMicrotask(() => {
    if (!targetNode.parentNode) {
      return;
    }

    observer.observe(targetNode.parentNode, { childList: true, subtree: true });
  });

  return () => {
    observer.disconnect();
  };
}
