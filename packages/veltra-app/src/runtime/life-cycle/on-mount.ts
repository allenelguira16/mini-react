export type MountFn = () => void | (() => void);

let mountContext: MountFn[] | null = null;

export function setMountContext(stack: (() => void)[]) {
  mountContext = stack;
}

export function detachMountContext() {
  mountContext = null;
}

export function onMount(fn: () => () => void): void;
export function onMount(fn: () => void): void;
export function onMount(fn: MountFn): void {
  if (mountContext) {
    mountContext.push(fn);
  } else {
    throw new Error("onMount called outside of component");
  }
}
