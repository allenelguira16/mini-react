import { jsx } from "~/jsx-runtime";
import { onDestroy, onMount } from "~/life-cycle";
import { effect, State } from "~/reactivity";
import { componentRootNodes, suspensePromise } from "~/render";

import { newEntries, removeEntryNodes, removeOldNodes, reorderEntries } from "./util";

type ForProps<T> = {
  items: () => T[];
  children: [(item: T, index: { value: number }) => JSX.Element];
};

export type Entry<T> = {
  id: number;
  item: T;
  nodes: Node[];
  index: { value: number };
};

/**
 * create a loop component
 *
 * @param items - The items to loop through.
 * @returns The loop component.
 */
export function loop<T>(items: T[]) {
  return {
    each: (children: (item: T, index: State<number>) => JSX.Element) => {
      // Use jsx to register it as a component
      // That way we can use life cycles hooks
      return jsx(
        (props: ForProps<T>) => {
          const {
            items: each,
            children: [children],
          } = props;

          const $rootNode = document.createTextNode("");

          let entries: Entry<T>[] = [];
          const idCounter = 0;

          function reconcile($parent: Node, items: T[]) {
            // Remove extra
            entries = removeOldNodes($parent, items, entries);
            // Add new
            entries.push(...newEntries(items, entries, children, idCounter));

            reorderEntries($rootNode, $parent, entries, items);
          }

          onMount(() => {
            effect(() => {
              const $parent = $rootNode.parentNode;
              if (!$parent) return;

              try {
                const list = each();
                if (!list) return;

                reconcile($parent, [...list]);
              } catch (errorOrPromise) {
                if (errorOrPromise instanceof Promise) {
                  suspensePromise.value = errorOrPromise;
                } else {
                  throw errorOrPromise;
                }
              }
            });
          });

          onDestroy(() => {
            for (const entry of entries) {
              removeEntryNodes($rootNode.parentNode!, entry);
            }
          });

          componentRootNodes.add($rootNode);
          return $rootNode;
        },
        {
          items: () => items,
          children,
        },
      );
    },
  };
}
