import { JSX } from "react";
import { applyStyle, eventMapper } from "../utils";
import { render } from "./render";

export async function renderNode(vNode: JSX.Element) {
  const tagName: keyof HTMLElementTagNameMap = vNode.type;
  const {
    children: vChildrenNode = [],
    style: vStyle,
    ...props
  }: Record<string, any> = vNode.props;

  const $dom = document.createElement(tagName);

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on")) {
      eventMapper.addEventListener($dom, key.slice(2).toLowerCase(), value);
    } else {
      $dom.setAttribute(key, value);
    }
  }

  if (vStyle && typeof vStyle === "object") {
    applyStyle($dom, vStyle);
  }

  await renderChildren($dom, vChildrenNode);

  return $dom;
}

const renderChildren = async (
  $parent: HTMLElement,
  vBaseChildrenNode: (JSX.Element | false)[]
) => {
  const vChildrenNode = Array.isArray(vBaseChildrenNode)
    ? vBaseChildrenNode
    : [vBaseChildrenNode];

  let $lastChild: Text | null = null;

  for (const vChildNode of vChildrenNode) {
    if (vChildNode === false) continue;

    const $child =
      typeof vChildNode === "string" || typeof vChildNode === "number"
        ? document.createTextNode(String(vChildNode))
        : await render(vChildNode);

    if ($child instanceof Text && $lastChild) {
      $lastChild.textContent = `${$lastChild.textContent}${$child.textContent}`;
      continue;
    }

    $parent.appendChild($child);
    $lastChild = $child instanceof Text ? $child : null;
  }
};
