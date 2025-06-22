import { toArray } from "~/util";

import { renderChildren } from "./render-children";

/**
 * create a root element
 *
 * @param $root - The root element.
 * @param App - The app to render.
 */
export function createRoot($root: HTMLElement, App: () => JSX.Element) {
  renderChildren($root, toArray(App()));
}
