import { jsxNotifier } from "./renderNotifier";

export type ComponentContext = {
  hooks: any[];
  effects: (() => void)[];
};

let hookIndex = 0;
const currentContext: ComponentContext = {
  hooks: [],
  effects: [],
};

export function setHookIndex(newHookIndex: number) {
  hookIndex = newHookIndex;
}

export function setCurrentContext(newCurrentContext: ComponentContext) {
  currentContext.effects = newCurrentContext.effects;
  currentContext.hooks = newCurrentContext.hooks;
}

export function state<T>(initial: T): [T, (value: T) => void] {
  const context = currentContext;
  const idx = hookIndex++;

  if (!context.hooks[idx]) {
    context.hooks[idx] = initial;
  }

  const setState = (newVal: T) => {
    context.hooks[idx] = newVal;
    jsxNotifier.update();
  };

  return [context.hooks[idx], setState] as const;
}

export function effect(fn: () => void | (() => void), deps?: any[]) {
  const context = currentContext!;
  const idx = hookIndex++;

  if (!context.hooks[idx]) {
    context.hooks[idx] = { deps: undefined, cleanup: undefined };
  }

  const effectState = context.hooks[idx];
  const hasChanged =
    !deps || deps.some((dep, i) => dep !== effectState.deps?.[i]);

  if (hasChanged) {
    // Save the effect for later execution after render
    context.effects.push(() => {
      // Run cleanup first
      if (typeof effectState.cleanup === "function") {
        effectState.cleanup();
      }

      const cleanup = fn();
      if (typeof cleanup === "function") {
        effectState.cleanup = cleanup;
      }

      effectState.deps = deps;
    });
  }
}
