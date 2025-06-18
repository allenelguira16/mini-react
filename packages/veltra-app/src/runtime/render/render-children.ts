import { onMount } from "../life-cycle";
import { effect as reactor, untrack } from "../state";
import { componentRootNodes } from "./mount-component";
import { patch } from "./patch";
import { getNode, memo, toArray } from "~/util";

export function renderChildren($parent: Node, children: JSX.Element[]) {
  for (const $child of children) {
    if (typeof $child === "function") {
      let $oldNodes: Node[] = [];
      let isFirstRender = true;

      reactor(() => {
        const $newNodes = toArray($child()).map(getNode).flat();

        $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);

        isFirstRender = false;
      });
    } else {
      const $node = getNode($child);
      if (!Array.isArray($node) && $node) {
        $parent.appendChild($node);
      }
    }
  }
}

export function Suspense(props: {
  fallback: JSX.Element;
  children: () => JSX.Element;
}) {
  const $rootNode = document.createTextNode("");
  const {
    fallback: _fallback,
    children: [_children],
  } = props as unknown as {
    fallback: () => JSX.Element;
    children: [() => () => JSX.Element];
  };
  const children = _children();
  const fallback = memo(() => _fallback());

  reactor(() => {
    try {
      // console.log(fallback);
      console.log(children());
    } catch (error) {
      console.log(error);
    }
  });

  onMount(() => {
    console.log("mounted");
  });

  // console.log(fallback());
  componentRootNodes.add($rootNode);
  return $rootNode;
  // const {
  //   children: [children],
  // } = props as unknown as {
  //   fallback: () => JSX.Element;
  //   children: [() => JSX.Element];
  // };

  // try {
  //   const content = children(); // run child component
  //   return content;
  // } catch (promiseOrError) {
  //   console.log("hi");
  //   if (promiseOrError instanceof Promise) {
  //     promiseOrError.then(() => {
  //       // somehow trigger re-render of Suspense
  //       // maybe use Veltra reactor to force update?
  //     });
  //     return props.fallback;
  //   } else {
  //     throw promiseOrError; // real error
  //   }
  // }
}
