import { JSX } from "react";
import { render, mount } from "./render";

export async function createApp($target: HTMLElement, vNode: JSX.Element) {
  mount($target, await render(vNode));
}
