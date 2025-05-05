export const jsxNotifier = (() => {
  let subscriber: (() => void) | undefined;

  return {
    update: () => {
      subscriber?.();
    },
    watch: (callback: () => void) => {
      subscriber = callback;
      callback();
    },
  };
})();
