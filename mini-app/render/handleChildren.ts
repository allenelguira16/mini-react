import { useEffect } from "../reactivity";

export function handleChildren(
  children: (
    | string
    | number
    | HTMLElement
    | Function
    | (string | number | HTMLElement)[]
  )[]
) {
  const $fragment = document.createDocumentFragment();

  for (const child of children) {
    appendChild($fragment, child);
  }

  return $fragment;
}

function appendChild(
  parent: Node,
  child:
    | string
    | number
    | HTMLElement
    | Function
    | (string | number | HTMLElement)[]
) {
  if (typeof child === "function") {
    const anchor = document.createTextNode("");
    parent.appendChild(anchor);
    let currentNodes: Node[] = [];

    useEffect(() => {
      const result = child();
      const normalized = Array.isArray(result) ? result : [result];
      const newNodes: Node[] = [];

      for (const item of normalized) {
        if (item instanceof Node) {
          newNodes.push(item);
        } else if (typeof item === "string" || typeof item === "number") {
          newNodes.push(document.createTextNode(String(item)));
        }
      }

      const parentNode = anchor.parentNode;
      if (!parentNode) return;

      // Remove old nodes
      for (const node of currentNodes) {
        if (node.parentNode === parentNode) {
          parentNode.removeChild(node);
        }
      }

      // Insert new nodes before the anchor
      for (const node of newNodes) {
        parentNode.insertBefore(node, anchor);
      }

      currentNodes = newNodes;
    });
  } else if (Array.isArray(child)) {
    const fragment = document.createDocumentFragment();
    child.forEach((nested) => appendChild(fragment, nested));
    parent.appendChild(fragment);
  } else if (typeof child === "string" || typeof child === "number") {
    parent.appendChild(document.createTextNode(String(child)));
  } else if (child instanceof Node) {
    parent.appendChild(child);
  }
}
