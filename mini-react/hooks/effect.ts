import { deepEqual } from "../utils";

export type EffectContext = {
  shouldRunOnce: boolean;

  index: number;
  cleanups: Function[];
  dependencies: any[];

  effectCallbacks: EffectCallback[];
};

type EffectCallback = () => void | Promise<void> | (() => void | Promise<void>);

export const effectFactory = (() => {
  let currentFunction: Function;
  const effectContextMap = new WeakMap<Function, EffectContext>();

  const getContext = (component: Function | undefined) => {
    if (!component) throw new Error("State must be called inside a component");

    const context = effectContextMap.get(component);

    if (!context) throw new Error("State must be called inside a component");

    return context;
  };

  return {
    registerComponent: (component: Function, context: EffectContext) => {
      currentFunction = component;

      if (effectContextMap.has(component)) return;

      effectContextMap.set(component, context);
    },
    effect: (callback: EffectCallback, newDependencies?: any[]) => {
      const component = currentFunction;
      const context = getContext(component);
      const idx = context.index++;

      const hasChanged =
        !newDependencies ||
        newDependencies.some(
          (dep, i) => !deepEqual(dep, context.dependencies[idx]?.[i])
        );

      if (!hasChanged && !context.shouldRunOnce) return;

      context.effectCallbacks.push(async () => {
        if (typeof context.cleanups[idx] === "function")
          context.cleanups[idx]();

        const cleanup = await callback();
        if (typeof cleanup === "function") context.cleanups[idx] = cleanup;

        context.dependencies[idx] = newDependencies;
      });
    },
  };
})();
