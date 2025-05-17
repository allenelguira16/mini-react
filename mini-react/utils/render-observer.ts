export const renderObserver = (() => {
  // let currentFunction: Function;
  const subscriberMap = new WeakMap<Function, Function>();

  // let subscribers: (() => void)[] = [];

  return {
    update: (component: Function) => {
      subscriberMap.get(component)?.();
    },
    watch: (callback: () => void, component: Function) => {
      if (!subscriberMap.has(component)) subscriberMap.set(component, callback);
    },
  };
})();
