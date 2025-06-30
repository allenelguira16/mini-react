import { jsx } from "~/jsx-runtime";
import { onDestroy, onMount } from "~/life-cycle";
import { effect, State } from "~/reactivity";
import { componentRootNodes } from "~/render";

import { newEntries, removeEntryNodes, removeOldNodes, reorderEntries } from "./util";

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
  // const handler = getCurrentSuspenseHandler();

  return {
    each: (children: (item: T, index: State<number>) => JSX.Element) => {
      const each = items as unknown as () => T[];
      children = children as unknown as [(item: T, index: State<number>) => JSX.Element][0];
      // Use jsx to register it as a component
      // That way we can use life cycles hooks
      // const trigger = state(() => each());
      // effect(() => {
      //   console.log(trigger.value());
      // });

      // untrack(() => each());

      return jsx(() => {
        const rootNode = document.createTextNode("");

        let entries: Entry<T>[] = [];
        // eslint-disable-next-line
        let idCounter = 0;

        function reconcile(parentNode: Node, items: T[]) {
          // Remove extra
          entries = removeOldNodes(parentNode, items, entries);
          // Add new
          entries.push(...newEntries(items, entries, children, idCounter));

          reorderEntries(rootNode, parentNode, entries, items);
        }

        const render = () => {
          const parentNode = rootNode.parentNode;
          if (!parentNode) return;

          const list = each();
          if (!list) return;

          reconcile(parentNode, [...list]);
        };

        onMount(() => {
          effect(() => {
            render();
          });
        });

        onDestroy(() => {
          for (const entry of entries) {
            removeEntryNodes(rootNode.parentNode!, entry);
          }
        });

        componentRootNodes.add(rootNode);
        return rootNode;
      }, {});
    },
  };
}
