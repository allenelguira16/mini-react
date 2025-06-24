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

  const node = untrack(() => type({ ...props, children }));
  let targetNode = node;

  if (Array.isArray(node)) {
    targetNode = document.createTextNode("");
    node.unshift(targetNode);
  }

  registerLifeCycles(lifecycleContext, targetNode);

  componentRootNodes.add(targetNode);
  return node;
}
