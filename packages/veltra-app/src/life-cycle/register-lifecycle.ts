import { setDestroyContext, setEffectContext, setMountContext } from "~/context";
import { removeEffect } from "../reactivity";
import { EffectFn } from "../reactivity";
import { registerComponentCleanup } from "./component-cleanup";
import { DestroyFn } from "./on-destroy";
import { MountFn } from "./on-mount";
import { onNodeReattached } from "~/util";

export type LifecycleContext = {
  mount: MountFn[];
  effect: EffectFn[];
  destroy: DestroyFn[];
};

export function registerLifeCycles(context: LifecycleContext, $target: Node) {
  const cleanups: (() => void)[] = [];

  setMountContext(null);
  setEffectContext(null);
  setDestroyContext(null);

  registerComponentCleanup($target, cleanups);

  // Pass cleanups once dom is painted
  queueMicrotask(() => {
    cleanups.push(
      ...context.destroy,
      ...context.mount.map((fn) => fn()).filter((c) => !!c),
      ...context.effect.map((fn) => () => removeEffect(fn)),
    );
  });

  // Re-run effect and memo when node is reattached
  onNodeReattached(() => {
    cleanups.push(...context.mount.map((fn) => fn()).filter((c) => !!c));
  }, $target);
}
