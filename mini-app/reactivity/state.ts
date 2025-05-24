import { currentEffect } from "./effect";

export function state<T>(initialValue?: T) {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  const get = () => {
    if (currentEffect) subscribers.add(currentEffect);
    return value;
  };

  const set = (newValue: T | ((prev: T) => T)) => {
    value =
      typeof newValue === "function" ? (newValue as Function)(value) : newValue;
    for (const sub of subscribers) sub();
  };

  return [get as () => T, set] as const;
}
