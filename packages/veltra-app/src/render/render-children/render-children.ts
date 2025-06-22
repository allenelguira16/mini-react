import { getNode, toArray } from "~/util";
import { suspenseReactor } from "./suspense-effect";
import { patch } from "./patch";

/**
 * render the children
 *
 * @param $parent - The parent node.
 * @param children - The children to render.
 * @param index - The index to insert the children at.
 */
export function renderChildren($parent: Node, children: JSX.Element[], index?: number) {
  let insertBeforeNode: ChildNode | null = null;

  if (index !== undefined) {
    insertBeforeNode = $parent.childNodes[index] as ChildNode;
  }

  for (const $child of children) {
    if (typeof $child === "function") {
      let $oldNodes: Node[] = [];
      let isFirstRender = true;

      suspenseReactor(() => {
        const $newNodes = toArray($child()).map(getNode).flat();
        $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);
        isFirstRender = false;
      });
    } else {
      const $node = getNode($child);
      if (!Array.isArray($node) && $node) {
        if (insertBeforeNode) {
          $parent.insertBefore($node, insertBeforeNode);
        } else {
          $parent.appendChild($node);
        }
      }
    }
  }
}
