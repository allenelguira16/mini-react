import { setDestroyContext, setEffectContext, setMountContext, setStateContext } from "~/context";
import { EffectFn, removeEffect, State } from "~/reactivity";
import { onNodeReattached } from "~/util";

import { setComponentCleanup } from "./component-cleanup";
import { DestroyFn } from "./on-destroy";
import { MountFn } from "./on-mount";

export type LifecycleContext = {
  mount: MountFn[];
  effect: EffectFn[];
  state: {
    states: State<any>[];
    index: number;
  };
  destroy: DestroyFn[];
};

/**
 * run the life cycle
 *
 * @param context - The lifecycle context.
 * @param targetNode - The target node.
 */
export function runLifecycle(context: LifecycleContext, targetNode: Node) {
  const cleanups: (() => void)[] = [];

  setMountContext(null);
  setStateContext(null);
  setEffectContext(null);
  setDestroyContext(null);

  setComponentCleanup(targetNode, cleanups);

  // Re-run memo when node is reattached
  onNodeReattached(() => {
    cleanups.push(...context.mount.map((fn) => fn()).filter((c) => !!c));
  }, targetNode);

  // Pass cleanups once dom is painted
  queueMicrotask(() => {
    cleanups.push(
      ...context.destroy,
      ...context.mount.map((fn) => fn()).filter((c) => !!c),
      ...context.effect.map((fn) => () => removeEffect(fn)),
    );
  });
}
