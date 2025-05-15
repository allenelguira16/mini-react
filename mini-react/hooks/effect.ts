import { deepEqual } from "../utils";

type EffectCallback = () => void | (() => void);

const effectsFactory = (() => {
  let currentIndex = 0;
  let cleanups: Function[] = [];
  let dependencies: any[] = [];

  let effects: EffectCallback[] = [];

  return {
    runEffects: () => {
      effects.forEach((effect) => effect());
    },
    resetEffects: () => {
      effects = [];
      currentIndex = 0;
    },
    effect: (callback: EffectCallback, newDependencies?: any[]) => {
      const idx = currentIndex++;

      const hasChanged =
        !newDependencies ||
        newDependencies.some(
          (dep, i) => !deepEqual(dep, dependencies[idx]?.[i])
        );

      if (!hasChanged) return;

      effects.push(() => {
        if (typeof cleanups[idx] === "function") cleanups[idx]();

        const cleanup = callback();
        if (typeof cleanup === "function") cleanups[idx] = cleanup;

        dependencies[idx] = newDependencies;
      });
    },
  };
})();

export const effect = effectsFactory.effect;
export const runEffects = effectsFactory.runEffects;
export const resetEffects = effectsFactory.resetEffects;
