import { effect } from "~/reactivity";

export function suspenseReactor(fn: () => void) {
  let cleanup: (() => void) | null = null;

  const run = () => {
    if (cleanup) cleanup();

    cleanup = effect(() => {
      try {
        fn();
      } catch (e) {
        if (e instanceof Promise) {
          e.then(run).catch(console.error);
        } else {
          console.error(e);
        }
      }
    });
  };

  run();
}
