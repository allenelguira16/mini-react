import { state } from "./state"; // your Veltra's state()
import { effect } from "./effect";

export type Computed<T> = {
  readonly value: T;
};

export function computed<T>(getter: () => T): Computed<T> {
  const result = state<T>(); // Real state that reactors and effects can track

  effect(() => {
    result.value = getter(); // when dependencies change, recompute and trigger .value
  });

  return {
    get value() {
      return result.value as T; // will track this as a true state()
    },
  };
}
