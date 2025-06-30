import { DestroyFn } from "~/life-cycle";

export let destroyContext: DestroyFn[] | null = null;

/**
 * set the destroy context
 *
 * @param newDestroyContext - The destroy context.
 */
export function setDestroyContext(newDestroyContext: (() => void)[] | null) {
  destroyContext = newDestroyContext;
}
