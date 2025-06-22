import { runComponentCleanup } from "~/life-cycle";
import { isNil } from "~/util";

/**
 * patch the old nodes with the new nodes
 *
 * @param $parent - The parent node.
 * @param $oldNodes - The old nodes.
 * @param $newNodes - The new nodes.
 * @param isFirstRender - Whether it is the first render.
 */
export function patch(
  $parent: Node,
  $oldNodes: Node[],
  $newNodes: (Node | undefined)[],
  isFirstRender: boolean,
) {
  const maxLength = Math.max($oldNodes.length, $newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const $oldNode = $oldNodes[i];
    const $newNode = $newNodes[i];

    if (isFirstRender) {
      if (isNil($newNode)) continue;

      $parent.appendChild($newNode);
      $oldNodes[i] = $newNode;

      continue;
    }

    // Add new node
    if (isNil($oldNode) && !isNil($newNode)) {
      $parent.appendChild($newNode);
      $oldNodes[i] = $newNode;
      continue;
    }

    // Remove old node
    if (!isNil($oldNode) && isNil($newNode)) {
      runComponentCleanup($oldNode);
      $parent.removeChild($oldNodes[i]);
      $oldNodes.splice(i, 1);
      i--;
      continue;
    }

    // If both empty, continue to next iteration
    if (isNil($oldNode) && isNil($newNode)) {
      continue;
    }

    if ($oldNode && $newNode) {
      // Replace node with node
      if (!$oldNode.isSameNode($newNode)) {
        runComponentCleanup($oldNode);
        ($oldNode as ChildNode).replaceWith($newNode);
        $oldNodes[i] = $newNode;
      }
      continue;
    }

    console.warn(`[veltra]: warning - unknown dom detected: `, {
      old: $oldNode,
      new: $newNode,
    });
  }

  return [...$oldNodes];
}
