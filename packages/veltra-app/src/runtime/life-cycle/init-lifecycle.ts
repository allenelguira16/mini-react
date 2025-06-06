import { setEffectContext, setReactorContext } from "../state";
import { setDestroyContext } from "./on-destroy";
import { setMountContext } from "./on-mount";
import { LifecycleContext } from "./register-lifecycle";

export function initializeLifecycleContext(context: LifecycleContext) {
  setMountContext(context.mount);
  setEffectContext(context.effect);
  setReactorContext(context.reactor);
  setDestroyContext(context.destroy);
}
