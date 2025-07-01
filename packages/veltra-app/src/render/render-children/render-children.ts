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
export function renderChildren(parentNode: Node, children: JSX.Element[], baseAnchor?: Node) {
  const cleanups: Record<"disposer" | "oldNodes", (() => void)[]> = {
    disposer: [],
    oldNodes: [],
  };

  for (const child of children) {
    const anchor = document.createTextNode("");
    parentNode.insertBefore(anchor, baseAnchor ?? null); // insert before main anchor

    let oldNodes: (ChildNode | undefined)[] = [];
    const handler = getCurrentSuspenseHandler();

    const run = () => {
      const disposer = effect(() => {
        let result: JSX.Element;
        let newNodes: (ChildNode | undefined)[] = [];

        try {
          result = typeof child === "function" ? child() : child;
          newNodes = toArray(getNode(result)) as ChildNode[];
        } catch (error) {
          if (error instanceof Promise) {
            if (handler) {
              handler(error);
            } else {
              error.then(() => {
                disposer();
                run();
              });
            }
          } else {
            throw error;
          }
        }

        oldNodes = patch(parentNode, oldNodes, newNodes, anchor);

        cleanups.oldNodes.push(() => {
          patch(parentNode, oldNodes, [], baseAnchor);
        });
      });

      cleanups.disposer.push(() => {
        disposer();
      });
    };

    run();
  }

  return () => {
    cleanups.disposer.forEach((cleanup) => cleanup());
    cleanups.oldNodes.forEach((cleanup) => cleanup());
  };
}
