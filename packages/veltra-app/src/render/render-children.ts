import { effect as reactor } from "../state";
import { patch } from "./patch";
import { getNode, toArray } from "~/util";

export function renderChildren(
  $parent: Node,
  children: JSX.Element[],
  index?: number
) {
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

function suspenseReactor(fn: () => void) {
  let cleanup: (() => void) | null = null;

  const run = () => {
    if (cleanup) cleanup();

    cleanup = reactor(() => {
      try {
        fn();
      } catch (e) {
        if (e instanceof Promise) {
          e.then(run).catch(console.error);
        } else {
          console.error(e);
        }
      }
    });
  };

  run();
}
