import { componentRootNodes } from "../render";

export function logJsx($nodes: Node[]) {
  const $newNodes = [
    ...$nodes.filter(
      ($node) => !($node instanceof Text && componentRootNodes.has($node))
    ),
  ];

  return $newNodes.length === 1 ? $newNodes[0] : $newNodes;
}
