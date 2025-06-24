import { toArray } from "~/util";

import { renderChildren } from "./render-children";

/**
 * create a root element
 *
 * @param rootElement - The root element.
 * @param App - The app to render.
 */
export function createRoot(rootElement: HTMLElement, App: () => JSX.Element) {
  renderChildren(rootElement, toArray(App()));
}
