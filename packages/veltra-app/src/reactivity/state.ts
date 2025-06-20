import { track, trigger } from "./track";

export type State<T> = {
  value: T;
};

export function state<T>(initialValue: T): State<T>;
export function state<T = undefined>(): State<T | undefined>;
export function state<T>(initialValue?: T): State<T | undefined> {
  const state = { value: initialValue };

  return new Proxy(state, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key as keyof typeof target];
      const result = Reflect.set(target, key, newValue, receiver);

      if (oldValue !== newValue) {
        trigger(target, key);
      }

      return result;
    },
  });
}
