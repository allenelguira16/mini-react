import { DestroyFn } from "~/life-cycle";

export let destroyContext: DestroyFn[] | null = null;

export function setDestroyContext(stack: (() => void)[] | null) {
  destroyContext = stack;
}
