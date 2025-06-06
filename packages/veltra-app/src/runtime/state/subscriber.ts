export type Subscriber = {
  (): void;
  subscriptions?: Set<Subscriber>;
};

const subscribers = new Set<Subscriber>();

export function getSubscriber() {
  return [...subscribers][subscribers.size - 1] || null;
}

export function watchSubscriber(fn: Subscriber) {
  subscribers.add(fn);
  fn();
  subscribers.delete(fn);
  return fn;
}
