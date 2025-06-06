import {
  Subscriber,
  detachEffectContext,
  detachReactorContext,
  removeEffect,
  removeReactor,
  wrapEffect,
  wrapReactor,
} from "../state";
import { registerComponentCleanup } from "./component-cleanup";
import { DestroyFn, detachDestroyContext } from "./on-destroy";
import { MountFn, detachMountContext } from "./on-mount";
import { onNodeReattached } from "~/util";

export type LifecycleContext = {
  mount: MountFn[];
  effect: Subscriber[];
  reactor: Subscriber[];
  destroy: DestroyFn[];
};

export function registerLifeCycles(context: LifecycleContext, $target: Node) {
  const cleanups: (() => void)[] = [];

  detachMountContext();
  detachEffectContext();
  detachReactorContext();
  detachDestroyContext();

  registerComponentCleanup($target, cleanups);

  // Pass cleanups once dom is painted
  queueMicrotask(() => {
    cleanups.push(
      ...context.destroy,
      ...context.mount.map((fn) => fn()).filter((c) => !!c),
      ...context.effect.map((fn) => () => removeEffect(fn)),
      ...context.reactor.map((fn) => () => removeReactor(fn))
    );
  });

  // Re-run effect and memo when node is reattached
  onNodeReattached(() => {
    context.effect.forEach((effect) => wrapEffect(effect));
    context.reactor.forEach((effect) => wrapReactor(effect));

    cleanups.push(...context.mount.map((fn) => fn()).filter((c) => !!c));
  }, $target);
}
