import { setDestroyContext, setEffectContext, setMountContext } from "~/context";
import { LifecycleContext } from "./register-lifecycle";

export function initializeLifecycleContext(context: LifecycleContext) {
  setMountContext(context.mount);
  setEffectContext(context.effect);
  setDestroyContext(context.destroy);
}
