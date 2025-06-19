// import { setDestroyContext } from "~/context";
// import { setEffectContext } from "../state";
// import { setDestroyContext } from "./on-destroy";
// import { setMountContext } from "./on-mount";
import {
  setDestroyContext,
  setEffectContext,
  setMountContext,
} from "~/context";
import { LifecycleContext } from "./register-lifecycle";

export function initializeLifecycleContext(context: LifecycleContext) {
  setMountContext(context.mount);
  setEffectContext(context.effect);
  setDestroyContext(context.destroy);
}
