import { onMount } from "~/life-cycle";

import { componentRootNodes } from "./mount-component";
import { renderChildren } from "./render-children";

const suspenseHandlerList: ((promise: Promise<void>) => void)[] = [];

/**
 * Suspense component
 *
 * @param props - The props of the component.
 * @returns The root node of the component.
 */
export function Suspense(props: { fallback?: JSX.Element; children: JSX.Element }) {
  const rootNode = document.createTextNode("");
  componentRootNodes.add(rootNode);

  const {
    fallback,
    children: [children],
  } = props as unknown as {
    fallback?: () => JSX.Element;
    children: [() => JSX.Element[]];
  };

  onMount(() => {
    const parentNode = rootNode.parentNode;

    if (!parentNode) return;

    const cleanups: (() => void)[] = [];

    const withSuspenseRender = (items: JSX.Element) => {
      suspenseHandlerList.push(handler);
      cleanups.push(renderChildren(parentNode, [items], rootNode));
      suspenseHandlerList.pop();
    };

    const handler = (promise: Promise<void>) => {
      queueMicrotask(() => {
        cleanups.forEach((cleanup) => cleanup());

        if (fallback) withSuspenseRender(fallback);
      });

      promise.then(() => {
        cleanups.forEach((cleanup) => cleanup());

        withSuspenseRender(children);
      });
    };

    withSuspenseRender(children);
  });

  return rootNode;
}

export function getCurrentSuspenseHandler() {
  return suspenseHandlerList[suspenseHandlerList.length - 1] as
    | ((promise: Promise<void>) => void)
    | undefined;
}
