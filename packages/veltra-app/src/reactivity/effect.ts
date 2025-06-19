import { effectContext } from "~/context";

// Effect function type with dependency tracking
export type EffectFn = (() => void) & { deps?: Set<EffectFn>[] };

// Currently active effect (global context for dependency collection)
export let activeEffect: EffectFn | null = null;

export function setActiveEffect(newActiveEffect: EffectFn | null) {
  activeEffect = newActiveEffect;
}

export function effect(fn: () => void): () => void {
  const wrappedEffect: EffectFn = () => {
    removeEffect(wrappedEffect);

    const previousEffect = activeEffect; // save previous activeEffect
    activeEffect = wrappedEffect;

    if (effectContext) {
      effectContext.push(wrappedEffect); // keep your effectContext intact
    }

    try {
      fn();
    } finally {
      activeEffect = previousEffect; // restore outer activeEffect
    }
  };

  wrappedEffect.deps = [];
  wrappedEffect();

  return () => removeEffect(wrappedEffect);
}

export function removeEffect(effect: EffectFn) {
  if (effect.deps) {
    for (const depSet of effect.deps) {
      depSet.delete(effect); // Remove this effect from all dependency sets
    }
    effect.deps.length = 0; // Reset dependency list
  }
}
