import { Children, JSX } from "react";
import { ComponentContext, setCurrentContext, setHookIndex } from "./state";
import { effect } from "./signal";
import { jsxNotifier } from "./renderNotifier";
import { addEventListener } from "./event-registry";

const componentContexts = new WeakMap<Function, ComponentContext>();

export function render(vNode: JSX.Element | string): HTMLElement | Text {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (typeof vNode.type === "function") {
    return renderComponent(vNode);
  }

  return renderNode(vNode);
}

export function renderComponent(vNode: JSX.Element) {
  const component: Function = vNode.type;
  const props: Record<string, any> = vNode.props || {};

  let context = componentContexts.get(component);

  if (!context) {
    context = { hooks: [], effects: [] };
    componentContexts.set(component, context);
  }

  setCurrentContext(context);
  setHookIndex(0);
  context.effects = [];

  const rendered = component(props);
  const $element = render(rendered);

  context.effects.forEach((effect) => effect());

  return $element;
}

export function renderNode(vNode: JSX.Element) {
  const tagName: keyof HTMLElementTagNameMap = vNode.type;
  const props: Record<string, any> = vNode.props;

  const $element = document.createElement(tagName);

  for (const key in props) {
    if (key === "children") continue;
    if (!key.startsWith("on")) {
      $element.setAttribute(key, props[key]);
      continue;
    }

    const event = key.slice(2).toLowerCase();

    addEventListener($element, event, props[key]);
  }

  const vChildrenNode = Array.isArray(props.children)
    ? props.children
    : [props.children];

  const children: (HTMLElement | Text)[] = [];

  for (const vChildNode of vChildrenNode) {
    const child = render(vChildNode);

    children.push(child);
  }

  for (const child of mergeAdjacentTextNodes(children)) {
    $element.appendChild(child);
  }

  return $element;
}

function mergeAdjacentTextNodes(nodes: (HTMLElement | Text)[]) {
  const result: (HTMLElement | Text)[] = [];

  for (const node of nodes) {
    const last = result[result.length - 1];

    if (last instanceof Text && node instanceof Text) {
      last.textContent = `${last.textContent}${node.textContent}`;
    } else {
      result.push(node);
    }
  }

  return result;
}
