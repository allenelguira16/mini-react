export let currentEffect: (() => void) | null = null;

export function effect(fn: () => void) {
  currentEffect = fn;
  fn();
  currentEffect = null;
}
