type EventRecord = {
  type: string;
  listener: EventListenerOrEventListenerObject;
};

export const eventMapper = (() => {
  const eventMap = new WeakMap<Element, EventRecord[]>();

  function addEventListener(
    element: Element,
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {
    const events = eventMap.get(element) || [];

    events.push({ type, listener });

    eventMap.set(element, events);
    element.addEventListener(type, listener);
  }

  function removeEventListeners(targetElement: Element) {
    for (const { type, listener } of getEventListener(targetElement)) {
      targetElement.removeEventListener(type, listener);
    }

    eventMap.delete(targetElement);
  }

  function copyEventListeners(toElement: Element, fromElement: Element) {
    removeEventListeners(toElement);

    const events = getEventListener(fromElement);

    for (const { type, listener } of events) {
      addEventListener(toElement, type, listener);
    }
  }

  function copyEventListenersDeep(to: Element, from: Element) {
    copyEventListeners(to, from); // Copy top-level listeners

    const fromChildren = Array.from(from.children);
    const toChildren = Array.from(to.children);

    for (let i = 0; i < fromChildren.length; i++) {
      const fromChild = fromChildren[i];
      const toChild = toChildren[i];

      if (fromChild && toChild) {
        copyEventListenersDeep(toChild, fromChild);
      }
    }
  }

  function getEventListener(targetElement: Element) {
    return eventMap.get(targetElement) || [];
  }

  return {
    addEventListener,
    removeEventListeners,
    copyEventListeners,
    copyEventListenersDeep,
    getEventListener,
  };
})();
