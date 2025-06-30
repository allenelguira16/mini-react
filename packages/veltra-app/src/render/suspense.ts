import { onMount } from "~/life-cycle";

import { componentRootNodes } from "./mount-component";
import { renderChildren } from "./render-children";

const suspenseHandlerList: ((promise: Promise<void>) => void)[] = [];

export function Suspense(props: { fallback?: JSX.Element; children: JSX.Element }) {
  const rootNode = document.createTextNode(""); // anchor
  componentRootNodes.add(rootNode);

  const {
    fallback,
    children: [children],
  } = props as unknown as {
    fallback?: () => JSX.Element;
    children: [() => JSX.Element[]];
  };

  onMount(() => {
    const parentNode = rootNode.parentNode!;

    if (!parentNode) return;

    const cleanups: (() => void)[] = [];

    const handler = (promise: Promise<void>) => {
      queueMicrotask(() => {
        cleanups.forEach((cleanup) => cleanup());

        if (fallback) {
          cleanups.push(renderChildren(parentNode, [fallback], rootNode));
        }
      });

      promise.then(() => {
        cleanups.forEach((cleanup) => cleanup());
        suspenseHandlerList.push(handler);
        cleanups.push(renderChildren(parentNode, [children], rootNode));
        suspenseHandlerList.pop();
      });
    };

    suspenseHandlerList.push(handler);
    cleanups.push(renderChildren(parentNode, [children], rootNode));
    suspenseHandlerList.pop();
  });

  return rootNode;
}

// function reset(root: ParentNode, keepElement: Node) {
//   console.log(root.childNodes);
//   for (const child of Array.from(root.childNodes)) {
//     if (child.contains(keepElement)) {
//       reset(child as unknown as ParentNode, keepElement);
//     } else {
//       child.remove();
//     }
//   }
// }

export function getCurrentSuspenseHandler() {
  return suspenseHandlerList[suspenseHandlerList.length - 1];
}
