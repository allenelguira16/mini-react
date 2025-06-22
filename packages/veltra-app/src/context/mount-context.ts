import { MountFn } from "~/life-cycle";

export let mountContext: MountFn[] | null = null;

export function setMountContext(stack: (() => void)[] | null) {
  mountContext = stack;
}
