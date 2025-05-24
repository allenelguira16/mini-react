export let currentEffect: (() => void) | null = null;

export function useEffect(fn: () => void) {
  currentEffect = fn;
  fn();
  currentEffect = null;
}
