import { handleChildren } from "./handleChildren";
import { handleProps } from "./handleProps";

export function createRoot($root: HTMLElement, app: JSX.Element) {
  $root.appendChild(app);
}

export function h(
  type: string | Function,
  props: Record<string, any>,
  children: (string | number | HTMLElement)[]
) {
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  const $element = document.createElement(type);

  handleProps($element, props);

  $element.appendChild(handleChildren(children));

  return $element;
}

export function Fragment({ children }: { children: any[] }) {
  return children;
}
