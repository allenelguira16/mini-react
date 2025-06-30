import {
  createStateContext,
  setDestroyContext,
  setEffectContext,
  setMountContext,
  setStateContext,
} from "~/context";

import { LifecycleContext } from "./run-lifecycle";

export function createLifeCycleContext(
  type: (props: Record<string, any>) => any,
  key?: number | string,
) {
  const context: LifecycleContext = {
    mount: [],
    state: createStateContext(type, key),
    effect: [],
    destroy: [],
  };

  setMountContext(context.mount);
  setStateContext(context.state);
  setEffectContext(context.effect);
  setDestroyContext(context.destroy);

  return context;
}
