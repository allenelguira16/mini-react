import { effect } from "../state";
import { getNode, normalizeDom } from "../util";

type ForProps<T> = {
  items: T[];
  children: (item: T, index: () => number) => JSX.Element;
  fallback?: JSX.Element;
  key?: (item: T) => any;
};

type ForPropsReal<T> = {
  items: () => T[];
  children: [() => (item: T, index: () => number) => JSX.Element];
  fallback?: () => JSX.Element;
  key?: (item: T) => any;
};

interface RefNode extends Text {
  ref?: (node: Node) => void;
}

export function For<T>(props: ForProps<T>): JSX.Element {
  const {
    items: each,
    children,
    fallback: _fallback,
    key = (item) => item,
  } = props as unknown as ForPropsReal<T>;

  const placeholder = document.createComment(" FOR ANCHOR ") as RefNode;
  const nodes = new Map<any, Node[]>();
  const fallback = _fallback?.();
  let previousKeys: any[] = [];

  placeholder.ref = (anchor: Node) => {
    effect(() => {
      const parent = anchor.parentNode;
      if (!parent) return;

      const items = each() || [];
      console.log(items);
      const nextKeys = items.map(key);
      const usedKeys = new Set();

      // Remove unused nodes
      for (const oldKey of previousKeys) {
        if (!nextKeys.includes(oldKey)) {
          const nodeGroup = nodes.get(oldKey);
          if (nodeGroup) {
            for (const node of nodeGroup) {
              parent.contains(node) && parent.removeChild(node);
            }
            nodes.delete(oldKey);
          }
        }
      }

      // Insert/move nodes in correct order
      let referenceNode = anchor.nextSibling;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemKey = key(item);
        usedKeys.add(itemKey);

        let domNodes: Node[];

        if (nodes.has(itemKey)) {
          domNodes = nodes.get(itemKey)!;
        } else {
          domNodes = normalizeDom(children[0]()(item, () => i)) as Node[];
          nodes.set(itemKey, domNodes);
        }

        // Only move if necessary (avoid redundant insertBefore)
        for (const node of domNodes) {
          if (node !== referenceNode) {
            parent.insertBefore(node, referenceNode);
          } else {
            // Already in correct position; move reference forward
            referenceNode = referenceNode.nextSibling;
          }
        }

        referenceNode = domNodes[domNodes.length - 1]?.nextSibling ?? null;
      }

      // Fallback logic
      if (fallback instanceof HTMLElement) {
        if (!items.length && !parent.contains(fallback)) {
          parent.insertBefore(fallback, anchor.nextSibling);
        } else if (!!items.length && parent.contains(fallback)) {
          parent.removeChild(fallback);
        }
      }

      previousKeys = nextKeys;
    });

    return anchor.parentNode;
  };

  return placeholder;
}
