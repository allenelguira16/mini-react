import { handleChildren } from "./handleChildren";
import { handleProps } from "./handleProps";

export function createRoot($root: HTMLElement, app: JSX.Element) {
  if (app instanceof HTMLElement) $root.appendChild(app);
}

export function h(
  type: string | Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  if (typeof type === "function") {
    for (const [key, value] of Object.entries(props)) {
      props[key] = value();
    }
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
