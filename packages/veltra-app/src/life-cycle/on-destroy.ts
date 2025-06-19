import { destroyContext } from "~/context";

export type DestroyFn = () => void;

export function onDestroy(fn: () => void) {
  if (destroyContext) {
    destroyContext.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}
