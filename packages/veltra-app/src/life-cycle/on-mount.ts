import { mountContext } from "~/context";

export type MountFn = () => void | (() => void);

export function onMount(fn: () => () => void): void;
export function onMount(fn: () => void): void;
export function onMount(fn: MountFn): void {
  if (mountContext) {
    mountContext.push(fn);
  } else {
    throw new Error("onMount called outside of component");
  }
}
