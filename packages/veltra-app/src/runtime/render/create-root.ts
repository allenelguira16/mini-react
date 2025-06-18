import { toArray } from "~/util";
import { renderChildren } from "./render-children";

export function createRoot($root: HTMLElement, App: () => JSX.Element) {
  renderChildren($root, toArray(App()));
}
