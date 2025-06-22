import { EffectFn } from "~/reactivity";

export let effectContext: EffectFn[] | null = null;

export function setEffectContext(newEffectContext: EffectFn[] | null) {
  effectContext = newEffectContext;
}
