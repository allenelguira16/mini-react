import { JSX } from "react";
import { renderComponent } from "./render-component";
import { renderNode } from "./render-node";

export function render(vNode: JSX.Element): Promise<HTMLElement> {
  if (typeof vNode.type === "function") {
    return renderComponent(vNode);
  }

  return renderNode(vNode);
}
