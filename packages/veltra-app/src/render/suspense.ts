import { effect, state } from "~/reactivity";
import { getNode, toArray } from "~/util";

import { patch } from "./render-children/patch";

export const suspensePromise = state<Promise<void> | null>(null);

/**
 * create a suspense component
 *
 * @param props - The properties of the component.
 * @returns The suspense component.
 */
export function Suspense(props: { fallback: JSX.Element; children: JSX.Element }) {
  const $rootNode = document.createTextNode("");
  let $parent: Node;

  // Change types since this is transformed by babel
  const {
    fallback: _fallback,
    children: [children],
  } = props as unknown as {
    fallback: () => JSX.Element;
    children: [() => JSX.Element[]];
  };

  const fallback = _fallback() as Node;

  let isFirstRender = true;
  let $oldNodes: Node[] = [];

  const renderFallback = () => {
    $oldNodes = patch($parent, $oldNodes, getNodes(fallback), isFirstRender);
    isFirstRender = false;
  };

  const renderSuspenseChildren = () => {
    const $newNodes = getNodes(children()).flat() as Node[];
    $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);
  };

  queueMicrotask(() => {
    $parent = $rootNode.parentNode as Node;

    effect(() => {
      try {
        if (!$parent) return;
        renderFallback();

        if (suspensePromise.value) throw suspensePromise.value;

        renderSuspenseChildren();
      } catch (errorOrPromise) {
        if (errorOrPromise instanceof Promise) {
          errorOrPromise
            .then(() => {
              suspensePromise.value = null;
              renderSuspenseChildren();
            })
            .catch(() => {});
        } else {
          throw errorOrPromise;
        }
      }
    });
  });

  // initial render is fallback node
  return $rootNode;
}

const getNodes = <T extends JSX.Element | Node>(items: T) => {
  const results: T[] = [];
  const flatItems = toArray(items);

  for (const item of flatItems) {
    const node = getNode(item); // Throws here if resource.value is pending
    if (Array.isArray(node)) {
      results.push(...(node as T[]));
    } else {
      results.push(node as T);
    }
  }

  return results;
};
