import { isNil } from "./is-node-nil";

/**
 * get the node for a JSX element
 *
 * @param jsxElement - The JSX element to get the node for.
 * @returns The node for the JSX element.
 */
export function getNode(jsxElement: JSX.Element): undefined | Node | (Node | undefined)[] {
  if (jsxElement instanceof Node) {
    return jsxElement;
  }

  if (isNil(jsxElement)) {
    return undefined;
  }

  if (typeof jsxElement === "function") {
    return getNode(jsxElement());
  }

  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode) as (Node | undefined)[];
  }

  return document.createTextNode(String(jsxElement));
}
