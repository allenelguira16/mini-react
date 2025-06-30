import { EffectFn } from "~/reactivity";

export let effectContext: EffectFn[] | null = null;

/**
 * set the effect context
 *
 * @param newEffectContext - The effect context.
 */
export function setEffectContext(newEffectContext: EffectFn[] | null) {
  effectContext = newEffectContext;
}
