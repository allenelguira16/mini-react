import { eventMapper } from "../utils";

export function patch($oldNode: HTMLElement, $newNode: HTMLElement) {
  // Text node
  if (
    $oldNode.nodeType === Node.TEXT_NODE &&
    $newNode.nodeType === Node.TEXT_NODE
  ) {
    if ($oldNode.textContent !== $newNode.textContent) {
      $oldNode.textContent = $newNode.textContent;
    }
    return;
  }

  // Mismatched node types or tags: replace entirely
  if (
    $oldNode.nodeType !== $newNode.nodeType ||
    ($oldNode instanceof HTMLElement &&
      $newNode instanceof HTMLElement &&
      $oldNode.tagName !== $newNode.tagName)
  ) {
    $oldNode.replaceWith($newNode);
    return;
  }

  // Update attributes if both are HTMLElements
  if ($oldNode instanceof HTMLElement && $newNode instanceof HTMLElement) {
    // Update attributes
    Array.from($oldNode.attributes).forEach((attr) => {
      if (!$newNode.hasAttribute(attr.name)) {
        $oldNode.removeAttribute(attr.name);
      }
    });

    Array.from($newNode.attributes).forEach((attr) => {
      if ($oldNode.getAttribute(attr.name) !== attr.value) {
        $oldNode.setAttribute(attr.name, attr.value);
      }
    });

    // Copy event listeners
    eventMapper.copyEventListeners($oldNode, $newNode);
  }

  // Recurse for all child nodes (including text nodes)
  const oldChildren = Array.from($oldNode.childNodes);
  const newChildren = Array.from($newNode.childNodes);
  const max = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < max; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (!oldChild && newChild) {
      // console.log($oldNode);
      // Append new child
      const $cloned = newChild.cloneNode(true);
      if ($cloned instanceof HTMLElement && newChild instanceof HTMLElement) {
        eventMapper.copyEventListenersDeep($cloned, newChild);
      }
      $oldNode.appendChild($cloned);
    } else if (oldChild && !newChild) {
      // Remove extra old child
      eventMapper.removeEventListeners(oldChild as HTMLElement);
      $oldNode.removeChild(oldChild);
    } else if (oldChild && newChild) {
      // Recurse
      patch(oldChild as HTMLElement, newChild as HTMLElement);
    }
  }
}
