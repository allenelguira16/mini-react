import { effect } from "../state";
import { getNode, isNil, normalizeDom } from "../util";

export function handleChildren(children: JSX.Element[]) {
  const $fragment = document.createDocumentFragment();

  for (const child of children) {
    appendChild($fragment, child);
  }

  return $fragment;
}

interface RefNode extends Text {
  ref?: (node: Node) => void;
}

function appendChild(parent: Node, child: JSX.Element) {
  if (typeof child === "function") {
    const anchor = document.createTextNode("");
    parent.appendChild(anchor);

    let oldNodes: JSX.Element[] = [];

    effect(() => {
      const result = child();
      const newNodes = normalizeDom(result);

      const parentNode = anchor.parentNode;
      if (!parentNode) return;

      patch(parentNode, oldNodes, newNodes, anchor);
    });
  } else if (Array.isArray(child)) {
    const fragment = document.createDocumentFragment();
    child.forEach((nested) => appendChild(fragment, nested));
    parent.appendChild(fragment);
  } else {
    const childRef = getNode(child) as RefNode;

    parent.appendChild(childRef);
    childRef.ref?.(childRef);
    delete childRef.ref;
  }
}

function patch(
  parentNode: Node,
  oldNodes: (JSX.Element | (() => JSX.Element))[],
  newNodes: any[],
  anchor: Node | null = null
) {
  const maxLength = Math.max(oldNodes.length, newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const oldNode = getNode(oldNodes[i]);
    const newNode = getNode(newNodes[i]);

    // Remove old node if new one doesn't exist
    if (!isNil(oldNode) && isNil(newNode) && oldNode instanceof HTMLElement) {
      parentNode.removeChild(oldNode);
      oldNodes.splice(i, 1);
      i--;
      continue;
    }

    // Add new node if cached one doesn't exist
    if (isNil(oldNode) && !isNil(newNode)) {
      parentNode.insertBefore(newNode, anchor);
      oldNodes[i] = newNode;
      continue;
    }

    // Update existing node
    if (isNil(oldNode) || isNil(newNode)) {
      // Only proceed if both nodes exist
      continue;
    }

    // Handle text-to-text update
    if (oldNode instanceof Text && newNode instanceof Text) {
      oldNode.textContent = newNode.textContent;
      continue;
    }

    // From here, we know cachedNode is an HTMLElement
    if (!(oldNode instanceof HTMLElement)) {
      continue;
    }

    // Case: HTMLElement → HTMLElement
    if (newNode instanceof HTMLElement) {
      const isSame = oldNode.isEqualNode(newNode);

      if (!isSame) {
        oldNode.replaceWith(newNode);
        oldNodes[i] = newNode;
      }

      continue;
    }

    // Case: HTMLElement → Text
    if (newNode instanceof Text) {
      oldNode.replaceWith(newNode);
      oldNodes[i] = newNode;
    }
  }
}
