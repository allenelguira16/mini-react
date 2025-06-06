import { Subscriber, getSubscriber } from "./subscriber";
import { shouldTrack } from "./untrack";

export type State<T> = {
  value: T;
};

export function state<T>(initialValue: T): State<T>;
export function state<T = undefined>(): State<T | undefined>;
export function state<T>(initialValue?: T): State<T | undefined> {
  let value = initialValue;
  let subscriptions = new Set<Subscriber>();

  return {
    get value() {
      if (!shouldTrack) return value;

      const subscriber = getSubscriber();
      if (subscriber && !subscriptions.has(subscriber)) {
        subscriptions.add(subscriber);
        subscriber.subscriptions = subscriptions;
      }

      return value;
    },
    set value(newValue) {
      value = newValue;

      subscriptions.forEach((fn) => fn());
    },
  };
}
