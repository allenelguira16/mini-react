import { createLifeCycleContext, runLifecycle } from "~/life-cycle";
import { untrack } from "~/reactivity";
import { toArray } from "~/util";

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
  { key: _key, ...props }: { key?: () => string } & Record<string, any>,
  children: JSX.Element[],
) {
  const key = _key?.();

  resolveComponentProps(type, props);

  const context = createLifeCycleContext(type, key);

  const targetNode = document.createTextNode("");
  const node = toArray(untrack(() => type({ ...props, children })));

  runLifecycle(context, targetNode);

  node.unshift(targetNode);
  componentRootNodes.add(targetNode);

  return node;
}
