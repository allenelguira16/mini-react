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
    return type({ ...props, children });
  }

  const $element = document.createElement(type);

  handleProps($element, props);

  handleChildren($element, children);

  return $element;
}

export function Fragment({ children }: { children: any[] }) {
  const placeholder = document.createComment(" FRAGMENT ANCHOR ");

  (placeholder as any).ref = (anchor: Node) => {
    if (!anchor.parentNode || !(anchor.parentNode instanceof HTMLElement))
      return;

    handleChildren(anchor.parentNode, children);
  };

  return placeholder;
}
