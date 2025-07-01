import { setDestroyContext, setEffectContext, setMountContext, setStateContext } from "~/context";
import { EffectFn, removeEffect, State } from "~/reactivity";

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

export const componentLifecycleContexts = new Map<Node, LifecycleContext>();

/**
 * run the life cycle
 *
 * @param context - The lifecycle context.
 * @param targetNode - The target node.
 */
export function runLifecycle(targetNode: Node) {
  const context = componentLifecycleContexts.get(targetNode);
  if (!context) return;

  const cleanups: (() => void)[] = [];

  setMountContext(null);
  setStateContext(null);
  setEffectContext(null);
  setDestroyContext(null);

  setComponentCleanup(targetNode, cleanups);

  // Pass cleanups once dom is painted
  queueMicrotask(() => {
    cleanups.push(
      ...context.destroy,
      ...context.mount.map((fn) => fn()).filter((c) => !!c),
      ...context.effect.map((fn) => () => removeEffect(fn)),
    );
  });
}
