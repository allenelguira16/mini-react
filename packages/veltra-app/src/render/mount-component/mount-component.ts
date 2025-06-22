import { initializeLifecycleContext, LifecycleContext, registerLifeCycles } from "~/life-cycle";
import { untrack } from "~/reactivity";

import { resolveComponentProps } from "./resolve-component-props";

export const componentRootNodes = new Set<Node>();

/**
 * mount a component
 *
 * @param type - The type of the component.
 * @param props - The properties of the component.
 * @param children - The children of the component.
 */
export function mountComponent(
  type: (props: Record<string, any>) => any,
  props: Record<string, any>,
  children: JSX.Element[],
) {
  resolveComponentProps(type, props);

  const lifecycleContext: LifecycleContext = {
    mount: [],
    effect: [],
    destroy: [],
  };

  initializeLifecycleContext(lifecycleContext);

  const $node = untrack(() => type({ ...props, children }));
  let $target = $node;

  if (Array.isArray($node)) {
    $target = document.createTextNode("");
    $node.unshift($target);
  }

  registerLifeCycles(lifecycleContext, $target);

  componentRootNodes.add($target);
  return $node;
}
