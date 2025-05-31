export type EffectFn = () =>
  | Promise<void | (() => void)>
  | (void | (() => void));

export let activeEffect: EffectFn | null = null;

export function effect(fn: EffectFn): void {
  const run = () => {
    activeEffect = run;
    fn();
    activeEffect = null;
  };
  run();
}

export function effectify(fn: EffectFn): EffectFn {
  const run = () => {
    activeEffect = run;
    fn();
    activeEffect = null;
  };
  run();
  return run;
}

const depMap: WeakMap<object, Map<PropertyKey, Set<EffectFn>>> = new WeakMap();

export function track(target: object): void {
  if (!activeEffect) return;

  let deps = depMap.get(target);
  if (!deps) {
    deps = new Map<PropertyKey, Set<EffectFn>>();
    depMap.set(target, deps);
  }

  let dep = deps.get("value");
  if (!dep) {
    dep = new Set<EffectFn>();
    deps.set("value", dep);
  }

  dep.add(activeEffect);
}

export function trigger(target: object): void {
  const deps = depMap.get(target);
  if (!deps) return;

  const dep = deps.get("value");
  if (!dep) return;

  for (const effect of dep) {
    effect();
  }
}
