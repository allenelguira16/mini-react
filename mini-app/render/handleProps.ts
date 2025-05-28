import { effect } from "../state";
import { UNIT_LESS_PROPS } from "../const";

export function handleProps($element: HTMLElement, props: Record<string, any>) {
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const type = key.slice(2).toLowerCase();
      let cleanup: () => void;

      effect(() => {
        // Remove the previous listener if there was one
        if (cleanup) cleanup();

        const fn = props[key]();
        if (typeof fn === "function") {
          $element.addEventListener(type, fn);
          // Setup cleanup for next effect run
          cleanup = () => $element.removeEventListener(type, fn);
        }
      });
    } else {
      effect(() => {
        const value = props[key];
        // console.log(value);
        if (key === "ref" && typeof value === "function") {
          value($element);
        } else if (key === "style") {
          const styles = typeof value === "function" ? value() : value;
          applyStyle($element, styles);
        } else {
          const attributeValue = typeof value === "function" ? value() : value;
          if (key === "disabled") $element.toggleAttribute(key, attributeValue);
          else $element.setAttribute(key, attributeValue);
        }
      });
    }
  }
}

function applyStyle($element: HTMLElement, style: Record<string, any>) {
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === "number" && !isUnitLessCSSProperty(key)) {
      // @ts-ignore
      $element.style[key] = `${value}px`;
    } else {
      // @ts-ignore
      $element.style[key] = value;
    }
  }
}

function isUnitLessCSSProperty(prop: string): boolean {
  const unitLessProps = new Set(UNIT_LESS_PROPS);

  return unitLessProps.has(prop);
}
