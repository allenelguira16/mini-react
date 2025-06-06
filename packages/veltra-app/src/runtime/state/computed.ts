import { Subscriber, watchSubscriber, getSubscriber } from "./subscriber";

export function computed<T>(fn: () => T) {
  let value: T;
  let subscriptions = new Set<Subscriber>();

  const subscriber: Subscriber = () => {
    // When a dependency changes, recompute:
    value = fn();
    // Notify anything that depends on this computed:
    subscriptions.forEach((sub) => sub());
  };

  // First run to collect dependencies:
  watchSubscriber(subscriber);
  value = fn(); // compute initial value

  return {
    get value() {
      // When someone accesses this computed, register as a dependency:
      const subscriber = getSubscriber();
      if (subscriber && !subscriptions.has(subscriber)) {
        subscriptions.add(subscriber);
        subscriber.subscriptions = subscriptions;
      }
      return value;
    },
  };
}
