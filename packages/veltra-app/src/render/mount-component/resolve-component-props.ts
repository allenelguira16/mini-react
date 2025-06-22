import { Suspense } from "../suspense";

const IGNORE_COMPONENT = [Suspense] as Function[];

/**
 * resolve the component props
 *
 * @param type - The type of the component.
 * @param props - The properties of the component.
 */
export function resolveComponentProps(type: Function, props: Record<string, any>) {
  if (IGNORE_COMPONENT.includes(type)) return;

  for (const key in props) {
    props[key] = props[key] instanceof Function ? props[key]() : props[key];
  }
}
