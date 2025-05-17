import { StateContext, stateFactory } from "./state";
import { EffectContext, effectFactory } from "./effect";
import { JSX } from "react/jsx-runtime";

export const $state = stateFactory.state;
export const $effect = effectFactory.effect;

export type JSXElementWithStore = JSX.Element & {
  _store: {
    context: {
      state: StateContext;
      effects: EffectContext;
    };
  } & Record<string, any>;
};

export const registerHooks = (
  component: Function,
  store: JSXElementWithStore["_store"]
) => {
  stateFactory.registerComponent(component, store.context.state);
  store.context.state.index = 0;

  effectFactory.registerComponent(component, store.context.effects);
  store.context.effects.index = 0;
  store.context.effects.effectCallbacks = [];
};

export const postProcessHooks = async (
  store: JSXElementWithStore["_store"]
) => {
  await Promise.all(
    store.context.effects.effectCallbacks.map(async (effect) => await effect())
  );
  store.context.effects.shouldRunOnce = false;
};
