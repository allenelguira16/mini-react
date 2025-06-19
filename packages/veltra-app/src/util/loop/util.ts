import { runComponentCleanup } from "~/life-cycle";
import { state, untrack } from "~/state";
import { Entry } from "./index";
import { toArray } from "../to-array";

// Helpers
export function removeEntryNodes<T>($parent: Node, entry: Entry<T>) {
  for (const node of entry.nodes) {
    if ($parent.contains(node)) {
      runComponentCleanup(node);
      $parent.removeChild(node);
    }
  }
}

export function insertNodes(
  $parent: Node,
  nodes: Node[],
  referenceNode: Node | null
) {
  for (const node of nodes) {
    $parent.insertBefore(node, referenceNode);
  }
}

export function reorderEntries<T>(
  $rootNode: Node,
  $parent: Node,
  entries: Entry<T>[],
  items: T[]
) {
  const placeCounts = new Map<T, number>();
  let ref: Node | null = $rootNode.nextSibling;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    placeCounts.set(item, (placeCounts.get(item) || 0) + 1);
    let count = 0;
    const entry = entries.find(
      (e) => e.item === item && ++count === placeCounts.get(item)
    );
    if (!entry) continue;
    untrack(() => (entry.index.value = i));
    insertNodes($parent, entry.nodes, ref);
    ref = entry.nodes[entry.nodes.length - 1].nextSibling;
  }
}

export function countOccurrences<T>(list: T[]) {
  const counts = new Map<T, number>();
  for (const item of list) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

export function removeOldNodes<T>(
  $parent: Node,
  items: T[],
  entries: Entry<T>[]
) {
  const newCounts = countOccurrences(items);
  const oldCounts = countOccurrences(entries.map((e) => e.item));

  return entries.filter((entry) => {
    if ((oldCounts.get(entry.item) ?? 0) > (newCounts.get(entry.item) ?? 0)) {
      removeEntryNodes($parent, entry);
      oldCounts.set(entry.item, (oldCounts.get(entry.item) ?? 0) - 1);
      return false;
    }
    return true;
  });
}

export function newEntries<T>(
  items: T[],
  entries: Entry<T>[],
  children: (
    item: T,
    index: {
      value: number;
    }
  ) => JSX.Element,
  idCounter: number
) {
  const addedEntries: Entry<T>[] = [];
  const seenCounts = new Map<T, number>();
  for (const item of items) {
    seenCounts.set(item, (seenCounts.get(item) || 0) + 1);
    const exists =
      entries.filter((e) => e.item === item).length +
      addedEntries.filter((e) => e.item === item).length;
    if (exists < (seenCounts.get(item) || 0)) {
      const indexState = state(-1);
      const nodes = toArray(children(item, indexState)) as Node[];
      addedEntries.push({
        id: idCounter++,
        item,
        nodes,
        index: indexState,
      });
    }
  }

  return addedEntries;
}
