import { effectify, track, trigger } from "./effect";

export function computed<T>(getter: () => T): { readonly value: T } {
  let cachedValue: T;
  let dirty = true;

  const obj = {
    get value(): T {
      if (dirty) {
        run();
        dirty = false;
      }
      track(obj, "value"); // allow others to depend on this computed
      return cachedValue;
    },
    set value(_: unknown) {
      throw new Error("Computed is read-only and cannot be modified");
    },
  };

  const run = effectify(() => {
    cachedValue = getter();
    dirty = false;
    trigger(obj, "value");
  });

  return obj;
}
