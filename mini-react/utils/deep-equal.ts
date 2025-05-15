type Memo = WeakMap<object, WeakMap<object, boolean>>;

export function deepEqual(a: any, b: any, memo: Memo = new WeakMap()): boolean {
  if (a === b) return true;
  if (a !== a && b !== b) return true; // NaN case
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;

  // Only memoize object comparisons
  if (typeof a === "object" && typeof b === "object") {
    let memoA = memo.get(a);
    if (memoA?.has(b)) return memoA.get(b)!;

    // Pre-store the result as false to prevent circular recursion
    if (!memoA) {
      memoA = new WeakMap();
      memo.set(a, memoA);
    }
    memoA.set(b, false); // Assume unequal by default

    if (a instanceof Date && b instanceof Date)
      return memoA.set(b, a.getTime() === b.getTime()).get(b)!;

    if (a instanceof RegExp && b instanceof RegExp)
      return memoA.set(b, a.toString() === b.toString()).get(b)!;

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (const [key, val] of a) {
        if (!b.has(key) || !deepEqual(val, b.get(key), memo)) return false;
      }
      return memoA.set(b, true).get(b)!;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (const val of a) {
        if (!b.has(val)) return false;
      }
      return memoA.set(b, true).get(b)!;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i], memo)) return false;
      }
      return memoA.set(b, true).get(b)!;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key], memo)) return false;
    }

    return memoA.set(b, true).get(b)!;
  }

  return false;
}
