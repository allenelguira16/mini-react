import {
  LifecycleContext,
  initializeLifecycleContext,
  registerLifeCycles,
} from "../life-cycle";
import { resolveComponentProps } from "./component-props";

export const componentRootNodes = new Set<Node>();

export function mountComponent(
  type: Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  resolveComponentProps(type, props);

  const lifecycleContext: LifecycleContext = {
    mount: [],
    effect: [],
    // reactor: [],
    destroy: [],
  };

  initializeLifecycleContext(lifecycleContext);

  let $node = type({ ...props, children });
  let $target = $node;

  if (Array.isArray($node)) {
    $target = document.createTextNode("");
    $node.unshift($target);
  }

  registerLifeCycles(lifecycleContext, $target);

  componentRootNodes.add($target);
  return $node;
}
