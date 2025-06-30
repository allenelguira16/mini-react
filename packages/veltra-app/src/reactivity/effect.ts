import { effectContext } from "~/context";

/**
 * Effect function type with dependency tracking
 *
 * @param deps - The dependencies of the effect.
 */
export type EffectFn = (() => void) & { deps?: Set<EffectFn>[] };

/**
 * Currently active effect
 */
export let activeEffect: EffectFn | null = null;

export function setActiveEffect(newActiveEffect: EffectFn | null) {
  activeEffect = newActiveEffect;
}

let lastDisposer: (() => void) | null = null;

/**
 * Create an effect
 *
 * @param fn - The effect function.
 * @returns The cleanup function.
 */
export function effect(fn: () => void): () => void {
  const wrappedEffect: EffectFn = () => {
    removeEffect(wrappedEffect);
    const previousEffect = activeEffect;
    activeEffect = wrappedEffect;

    if (effectContext) effectContext.push(wrappedEffect);

    try {
      fn();
    } finally {
      activeEffect = previousEffect;
    }
  };

  wrappedEffect.deps = [];
  wrappedEffect();

  const disposer = () => removeEffect(wrappedEffect);
  lastDisposer = disposer; // ✅ track disposer for stopEffect

  return disposer;
}

export function stopEffect() {
  queueMicrotask(() => {
    if (lastDisposer) {
      lastDisposer();
      lastDisposer = null;
    }
  });
}

/**
 * Remove an effect
 *
 * @param effect - The effect to remove.
 */
export function removeEffect(effect: EffectFn) {
  if (effect.deps) {
    for (const depSet of effect.deps) {
      depSet.delete(effect); // Remove this effect from all dependency sets
    }
    effect.deps.length = 0; // Reset dependency list
  }
}
