export type DestroyFn = () => void;

let destroyContext: DestroyFn[] | null = null;

export function setDestroyContext(stack: (() => void)[]) {
  destroyContext = stack;
}

export function detachDestroyContext() {
  destroyContext = null;
}

export function onDestroy(fn: () => void) {
  if (destroyContext) {
    destroyContext.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}
