import { JSX } from "react";
import { renderComponent } from "./render-component";
import { renderNode } from "./render-node";

export function render(vNode: JSX.Element | string): HTMLElement | Text {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (typeof vNode.type === "function") {
    return renderComponent(vNode);
  }

  return renderNode(vNode);
}
