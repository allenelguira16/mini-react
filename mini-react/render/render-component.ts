import { JSX } from "react";
import { render } from "./render";
import { renderObserver } from "../utils";
import { patch } from "./patch";
import { JSXElementWithStore, postProcessHooks, registerHooks } from "../hooks";

export async function renderComponent(_vNode: JSX.Element) {
  const vNode = _vNode as JSXElementWithStore;
  const component: Function = vNode.type;
  const props: Record<string, any> = vNode.props || {};

  let store = vNode._store;

  if (!store.context) {
    store.context = {
      effects: {
        shouldRunOnce: true,
        index: 0,
        cleanups: [],
        dependencies: [],

        effectCallbacks: [],
      },
      state: {
        index: 0,
        states: [],
        shouldUpdate: false,
      },
    };
  }

  registerHooks(component, store);

  let $element = await render(component(props));

  await postProcessHooks(store);

  renderObserver.watch(async () => {
    const $newElement = await renderComponent(vNode);
    patch($element, $newElement);
  }, component);

  return $element;
}
