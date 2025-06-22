/**
 * observe a node and call a callback when it is removed
 *
 * @param $target - The target node to observe.
 * @param callback - The callback to call when the node is removed.
 */
export const unMount = ($target: Node, callback: Function) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const isRemoved = Array.from(mutation.removedNodes).includes($target);

      if (isRemoved) {
        callback();
        observer.disconnect();
      }
    }
  });

  if ($target.parentNode) observer.observe($target.parentNode, { childList: true, subtree: true });
};
