import { toArray } from "~/util";

import { renderChildren } from "./render-children";

/**
 * create root app
 *
 * @param rootElement - The root element.
 * @param App - The app to render.
 */
export function createApp(App: () => JSX.Element) {
  let cleanup: (() => void) | undefined;

  return {
    mount: (id: string) => {
      const node = document.querySelector(id);

      if (!(node instanceof Element)) throw new Error("Node must be of type Element");

      cleanup = renderChildren(node, toArray(App()));
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");

      cleanup();
    },
  };
}
