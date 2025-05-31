import { effect } from "../state";
import { getNode, isNil, normalizeDom } from "../util";

export function handleChildren($parent: HTMLElement, children: JSX.Element[]) {
  for (const child of children) {
    appendChild($parent, child);
  }
}

function appendChild(parent: Node, child: JSX.Element) {
  if (typeof child === "function") {
    let oldNodes: JSX.Element[] = [];

    effect(() => {
      const result = child();

      const newNodes = normalizeDom(result);
      // console.log(child);

      patch(parent, oldNodes, newNodes);
      // handleRef(result);
    });
  } else if (Array.isArray(child)) {
    child.forEach((nested) => appendChild(parent, nested));
  } else {
    const result = getNode(child) as Node;
    parent.appendChild(result);
    handleRef(result);
  }
}

function handleRef(_node: Node) {
  interface RefNode extends Text {
    ref?: (node: Node) => void;
  }

  const node = _node as RefNode;

  if ("ref" in node) {
    node.ref?.(node);
    delete node.ref;
    console.log(node.parentNode);
    return node;
  }

  return node as Node;
}

function patch(
  parentNode: Node,
  oldNodes: (JSX.Element | (() => JSX.Element))[],
  newNodes: any[],
  anchor: Node | null = null
) {
  const maxLength = Math.max(oldNodes.length, newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    let oldNode = getNode(oldNodes[i]);
    let newNode = getNode(newNodes[i]);

    // console.log(oldNode, newNode);

    // Remove old node if new one doesn't exist
    if (!isNil(oldNode) && isNil(newNode) && oldNode instanceof HTMLElement) {
      parentNode.removeChild(oldNode);
      oldNodes.splice(i, 1);
      i--;
    }
    // Add new node if cached one doesn't exist
    else if (isNil(oldNode) && !isNil(newNode)) {
      parentNode.insertBefore(newNode, anchor);
      oldNodes[i] = handleRef(newNode);
    }

    // Update existing node
    else if (isNil(oldNode) || isNil(newNode)) {
      // Only proceed if both nodes exist
    }

    // Handle text-to-text update
    else if (oldNode instanceof Text && newNode instanceof Text) {
      oldNode.textContent = newNode.textContent;
    }

    // From here, we know cachedNode is an HTMLElement
    else if (!(oldNode instanceof HTMLElement)) {
      // continue;
    }

    // Case: HTMLElement → HTMLElement
    else if (newNode instanceof HTMLElement) {
      const isSame = oldNode.isEqualNode(newNode);

      if (!isSame) {
        oldNode.replaceWith(newNode);
        oldNodes[i] = handleRef(newNode);
      }
    }
    // Case: HTMLElement → Text
    else if (newNode instanceof Text) {
      oldNode.replaceWith(newNode);
      oldNodes[i] = handleRef(newNode);
    }

    // if (newNode instanceof Comment) {
    //   newNodes[i] = newNode.ref(newNode);
    // }
  }
}
