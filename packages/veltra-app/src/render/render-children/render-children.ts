import { effect } from "~/reactivity";
import { getNode, toArray } from "~/util";

import { getCurrentSuspenseHandler } from "../suspense";
import { patch } from "./patch";

/**
 * render the children
 *
 * @param parentNode - The parent node.
 * @param children - The children to render.
 */
export function renderChildren(
  parentNode: Node,
  children: JSX.Element[],
  anchor: Node = document.createTextNode(""),
) {
  if (!parentNode.contains(anchor)) {
    parentNode.appendChild(anchor);
  }

  const cleanupDomNodes: (() => void)[] = [];

  for (const child of children) {
    let oldNodes: (ChildNode | undefined)[] = [];
    const handler = getCurrentSuspenseHandler();

    const disposer = effect(() => {
      let result: JSX.Element;
      let newNodes: (ChildNode | undefined)[] = [];

      try {
        result = typeof child === "function" ? child() : child;
        newNodes = toArray(getNode(result)) as ChildNode[];
      } catch (error) {
        if (error instanceof Promise) {
          if (handler) {
            queueMicrotask(() => {
              disposer();
            });
            handler(error);
          }
        } else {
          throw error;
        }
      } finally {
        oldNodes = patch(parentNode, oldNodes, newNodes, anchor);

        cleanupDomNodes.push(() => {
          patch(parentNode, oldNodes, [], anchor);
        });
      }
    });

    cleanupDomNodes.push(() => {
      disposer();
    });
  }

  return () => {
    cleanupDomNodes.forEach((cleanup) => cleanup());
  };
}
