import { getNode, toArray } from "~/util";

import { patch } from "./patch";
import { suspenseReactor } from "./suspense-effect";

/**
 * render the children
 *
 * @param parentNode - The parent node.
 * @param children - The children to render.
 * @param index - The index to insert the children at.
 */
export function renderChildren(parentNode: Node, children: JSX.Element[], index?: number) {
  let insertBeforeNode: ChildNode | null = null;

  if (index !== undefined) {
    insertBeforeNode = parentNode.childNodes[index] as ChildNode;
  }

  for (const childNode of children) {
    if (typeof childNode === "function") {
      let oldNodes: Node[] = [];
      let isFirstRender = true;

      suspenseReactor(() => {
        const newNodes = toArray(childNode()).map(getNode).flat();
        oldNodes = patch(parentNode, oldNodes, newNodes, isFirstRender);
        isFirstRender = false;
      });
    } else {
      const node = getNode(childNode);
      if (!Array.isArray(node) && node) {
        if (insertBeforeNode) {
          parentNode.insertBefore(node, insertBeforeNode);
        } else {
          parentNode.appendChild(node);
        }
      }
    }
  }
}
