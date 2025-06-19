import { activeEffect, setActiveEffect } from "./effect";

export function untrack<T>(fn: () => T): T {
  const prevEffect = activeEffect;
  setActiveEffect(null); // disable tracking

  try {
    return fn();
  } finally {
    setActiveEffect(prevEffect); // restore previous tracking context
  }
}
