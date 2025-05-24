import { effect } from "../reactivity";

export function handleChildren(children: JSX.Element[]) {
  const $fragment = document.createDocumentFragment();

  for (const child of children) {
    appendChild($fragment, child);
  }

  return $fragment;
}

function appendChild(parent: Node, child: JSX.Element) {
  if (typeof child === "function") {
    const anchor = document.createTextNode("");
    parent.appendChild(anchor);
    let currentNodes: Node[] = [];

    effect(() => {
      const result = child();
      const normalized = Array.isArray(result) ? result : [result];

      const parentNode = anchor.parentNode;
      if (!parentNode) return;

      const newNodes: Node[] = normalized
        .map((item) => {
          if (item instanceof Node) return item;
          if (typeof item === "string" || typeof item === "number") {
            return document.createTextNode(String(item));
          }
        })
        .filter((n) => !!n);

      // --- Diff algorithm ---
      let i = 0;
      for (; i < newNodes.length && i < currentNodes.length; i++) {
        const newNode = newNodes[i];
        const oldNode = currentNodes[i];

        if (
          newNode.nodeType === Node.TEXT_NODE &&
          oldNode.nodeType === Node.TEXT_NODE
        ) {
          if ((newNode as Text).data !== (oldNode as Text).data) {
            (oldNode as Text).data = (newNode as Text).data;
          }
          newNodes[i] = oldNode; // reuse old node
        } else if (newNode.isEqualNode(oldNode)) {
          newNodes[i] = oldNode; // reuse identical node
        } else {
          parentNode.replaceChild(newNode, oldNode);
        }
      }

      // Remove extra old nodes
      while (i < currentNodes.length) {
        const oldNode = currentNodes[i];
        if (oldNode.parentNode === parentNode) {
          parentNode.removeChild(oldNode);
        }
        i++;
      }

      // Add new extra nodes
      while (i < newNodes.length) {
        parentNode.insertBefore(newNodes[i], anchor);
        i++;
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
