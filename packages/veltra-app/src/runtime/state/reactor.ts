import { Subscriber, watchSubscriber } from "./subscriber";

let reactorContext: Subscriber[] | null = null;

export function setReactorContext(stack: Subscriber[]) {
  reactorContext = stack;
}

export function detachReactorContext() {
  reactorContext = null;
}

export function removeReactor(subscriber: Subscriber) {
  if (!subscriber.subscriptions) return;

  for (const subscription of subscriber.subscriptions) {
    subscriber.subscriptions.delete(subscription);
  }
}

export function reactor(fn: Subscriber) {
  return wrapReactor(fn);
}

export function wrapReactor(fn: Subscriber): Subscriber {
  const subs: Subscriber = () => fn();
  reactorContext?.push(subs);
  return watchSubscriber(subs);
}
