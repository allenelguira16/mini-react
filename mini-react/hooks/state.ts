import { deepEqual, renderObserver } from "../utils";

export type StateContext = {
  index: number;
  states: any[];
  shouldUpdate: boolean;
};

export const stateFactory = (() => {
  let currentFunction: Function;
  const stateContextMap = new WeakMap<Function, StateContext>();

  const getContext = (component: Function | undefined) => {
    if (!component) throw new Error("State must be called inside a component");

    const context = stateContextMap.get(component);

    if (!context) throw new Error("State must be called inside a component");

    return context;
  };

  return {
    registerComponent: (component: Function, context: StateContext) => {
      currentFunction = component;

      if (stateContextMap.has(component)) return;

      stateContextMap.set(component, context);
    },
    state: <T>(initial: T): [T, (value: T) => void] => {
      const component = currentFunction;
      const context = getContext(component);
      const idx = context.index++;

      if (!context.states[idx]) {
        context.states[idx] = initial;
      }

      const setState = (newVal: T) => {
        if (deepEqual(context.states[idx], newVal)) return;

        context.states[idx] = newVal;
        context.shouldUpdate = true;

        renderObserver.update(component);
      };

      return [context.states[idx], setState] as const;
    },
  };
})();
