import { UNIT_LESS_PROPS } from "~/const";

import { effect as reactor } from "../reactivity";

/**
 * apply the properties to the element
 *
 * @param $element - The element to apply the properties to.
 * @param props - The properties to apply.
 */
export function applyProps($element: HTMLElement | Element, props: Record<string, any>) {
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const type = key.slice(2).toLowerCase();
      let cleanup: () => void;

      reactor(() => {
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
      reactor(() => {
        const value = typeof props[key] === "function" ? props[key]() : props[key];

        if (key === "ref" && typeof value === "function") {
          value($element);
        } else if (key === "style") {
          applyStyle($element, value);
        } else if (key === "disabled") {
          $element.toggleAttribute(key, value);
        } else {
          $element.setAttribute(key, value);
        }
      });
    }
  }
}

/**
 * apply the style to the element
 *
 * @param $element - The element to apply the style to.
 * @param style - The style to apply.
 */
function applyStyle($element: HTMLElement | Element, style: Record<string, any>) {
  if (!($element instanceof HTMLElement)) return;

  for (const [key, value] of Object.entries(style)) {
    const cssKey = key as keyof CSSStyleDeclaration;
    if (cssKey === "length" || cssKey === "parentRule") continue;

    const isNumber = typeof value === "number";
    const needsUnit = isNumber && !isUnitLessCSSProperty(key);
    const finalValue = needsUnit ? `${value}px` : String(value);

    $element.style.setProperty(String(cssKey), finalValue);
  }
}

/**
 * check if a property is a unitless CSS property
 *
 * @param prop - The property to check.
 * @returns True if the property is a unitless CSS property.
 */
function isUnitLessCSSProperty(prop: string): boolean {
  const unitLessProps = new Set(UNIT_LESS_PROPS);

  return unitLessProps.has(prop);
}
