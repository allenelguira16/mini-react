import { MountFn } from "~/life-cycle";

export let mountContext: MountFn[] | null = null;

/**
 * set the mount context
 *
 * @param newMountStack - The mount context.
 */
export function setMountContext(newMountStack: (() => void)[] | null) {
  mountContext = newMountStack;
}
