import { JSX } from "react";
import { render } from "./render";

export function renderComponent(vNode: JSX.Element) {
  const component: Function = vNode.type;
  const props: Record<string, any> = vNode.props || {};

  const rendered = component(props);
  const $element = render(rendered);

  return $element;
}
