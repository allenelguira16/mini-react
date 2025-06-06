import { Subscriber, watchSubscriber } from "./subscriber";

let effectContext: Subscriber[] | null = null;

export function setEffectContext(stack: Subscriber[]) {
  effectContext = stack;
}

export function detachEffectContext() {
  effectContext = null;
}

export function removeEffect(subscriber: Subscriber) {
  if (!subscriber.subscriptions) return;

  for (const subscription of subscriber.subscriptions) {
    subscriber.subscriptions.delete(subscription);
  }
}

export function effect(fn: Subscriber) {
  return wrapEffect(fn);
}

export function wrapEffect(fn: Subscriber): () => void {
  const subs: Subscriber = () => fn();
  effectContext?.push(subs);
  return watchSubscriber(subs);
}
