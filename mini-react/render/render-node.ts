import { JSX } from "react";
import { applyStyle, eventMapper } from "../utils";
import { render } from "./render";

export function renderNode(vNode: JSX.Element) {
  const tagName: keyof HTMLElementTagNameMap = vNode.type;
  const {
    children: vBaseChildrenNode = [],
    style: vStyle,
    ...props
  }: Record<string, any> = vNode.props;

  const $dom = document.createElement(tagName);

  for (const [key, value] of Object.entries(props)) {
    if (!key.startsWith("on")) {
      $dom.setAttribute(key, value);
      continue;
    }

    const type = key.slice(2).toLowerCase();

    eventMapper.addEventListener($dom, type, value);
  }

  if (vStyle && typeof vStyle === "object") {
    applyStyle($dom, vStyle);
  }

  const vChildrenNode = Array.isArray(vBaseChildrenNode)
    ? vBaseChildrenNode
    : [vBaseChildrenNode];

  let $lastChild: Text | null = null;

  for (const vChildNode of vChildrenNode) {
    if (vChildNode === false) continue;

    const $child = render(vChildNode);

    if ($child instanceof Text && $lastChild) {
      $lastChild.textContent = `${$lastChild.textContent}${$child.textContent}`;
      continue;
    }

    $dom.appendChild($child);
    $lastChild = $child instanceof Text ? $child : null;
  }

  return $dom;
}
