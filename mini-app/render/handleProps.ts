import { effect } from "../reactivity";
import { UNIT_LESS_PROPS } from "../const";

export function handleProps($element: HTMLElement, props: Record<string, any>) {
  for (const key in props) {
    effect(() => {
      const value = props[key];
      if (key === "ref" && typeof value === "function") {
        value($element);
      } else if (key === "style") {
        const styles = value();
        applyStyle($element, styles);
      } else if (key.startsWith("on") && typeof value === "function") {
        const type = key.slice(2).toLowerCase();
        $element.addEventListener(type, value);
      } else {
        const attributeValue = typeof value === "function" ? value() : value;
        if (key === "disabled") $element.toggleAttribute(key, attributeValue);
        else $element.setAttribute(key, attributeValue);
      }
    });
  }
}

function isEmpty(obj: Record<string, any>) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
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
