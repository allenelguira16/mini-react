import { JSX } from "react";
import { render } from "./render";
import { jsxNotifier } from "./renderNotifier";
import { copyEventListeners, getEventListener } from "./event-registry";

export async function createApp(target: HTMLElement, vNode: JSX.Element) {
  let $rootElement: HTMLElement | Text;

  jsxNotifier.watch(() => {
    if (!$rootElement) {
      $rootElement = mount(target, render(vNode));
    } else {
      const $newNode = render(vNode);
      patch($rootElement as HTMLElement, $newNode as HTMLElement);
    }
  });
}

function patch($oldNode: HTMLElement, $newNode: HTMLElement): void {
  // If they are not the same tag, replace entirely
  if ($oldNode.tagName !== $newNode.tagName) {
    $oldNode.replaceWith($newNode);
    return;
  }

  // Update attributes
  Array.from($oldNode.attributes).forEach(attr => {
    if (!$newNode.hasAttribute(attr.name)) {
      $oldNode.removeAttribute(attr.name);
    }
  });

  Array.from($newNode.attributes).forEach(attr => {
    if ($oldNode.getAttribute(attr.name) !== attr.value) {
      $oldNode.setAttribute(attr.name, attr.value);
    }
  });

  // Remove old listeners
  copyEventListeners($newNode, $oldNode);

  // Text content node (e.g., <div>Hello</div>)
  if ($oldNode.childNodes.length === 1 && $oldNode.firstChild?.nodeType === Node.TEXT_NODE &&
    $newNode.childNodes.length === 1 && $newNode.firstChild?.nodeType === Node.TEXT_NODE) {
    if ($oldNode.textContent !== $newNode.textContent) {
      $oldNode.textContent = $newNode.textContent;
    }
    return;
  }

  // Recurse for children
  const oldChildren = Array.from($oldNode.children);
  const newChildren = Array.from($newNode.children);

  const max = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < max; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (!oldChild && newChild) {
      // Append new child
      $oldNode.appendChild(newChild.cloneNode(true));
    } else if (oldChild && !newChild) {
      // Remove extra old child
      $oldNode.removeChild(oldChild);
    } else if (oldChild && newChild) {
      // Recurse
      patch(oldChild as HTMLElement, newChild as HTMLElement);
    }
  }
}

function mount($target: HTMLElement | Text, $node: HTMLElement | Text) {
  if ($target instanceof HTMLElement)
    $target.replaceChildren($node);

  return $node;
}
