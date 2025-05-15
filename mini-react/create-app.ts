import { JSX } from "react";
import { runEffects, resetHooks } from "./hooks";
import { renderObserver } from "./utils";
import { render, mount, patch } from "./render";

export async function createApp($target: HTMLElement, vNode: JSX.Element) {
  let $rootElement: HTMLElement | Text;

  renderObserver.watch(() => {
    resetHooks();
    const $newNode = render(vNode);

    if (!$rootElement) {
      $rootElement = mount($target, $newNode);
    } else {
      patch($rootElement as HTMLElement, $newNode as HTMLElement);
    }

    runEffects();
  });
}
