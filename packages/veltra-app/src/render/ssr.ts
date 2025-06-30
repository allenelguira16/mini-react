/**
 * Create a JSX element for SSR
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element for SSR.
 */
export function hSSR(
  type: string | ((props: Record<string, any>) => any),
  props: Record<string, any>,
  children: JSX.Element[],
) {
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  return `<${type} ${handlePropsSSR(props)}>${handleChildrenSSR(children)}</${type}>`;
}

/**
 * Handle the properties of the element for SSR
 *
 * @param props - The properties of the element.
 * @returns The transformed properties.
 */
function handlePropsSSR(props: Record<string, any>) {
  const transformedProps: string[] = [];

  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      continue;
    }

    const value = typeof props[key] === "function" ? props[key]() : props[key];

    if (key === "ref" && typeof value === "function") {
      // value($element);
    } else if (key === "style") {
      // applyStyle($element, value);
    } else if (key === "disabled" && value) {
      transformedProps.push("disabled");
    } else {
      transformedProps.push(`${key}="${value}"`);
    }
  }

  return transformedProps.join(" ");
}

/**
 * Handle the children of the element for SSR
 *
 * @param children - The children of the element.
 * @returns The transformed children.
 */
function handleChildrenSSR(children: JSX.Element[]) {
  const transformedChildren: string[] = [];

  for (const child of children) {
    if (typeof child === "function") {
      transformedChildren.push(String(child()));
    } else if (Array.isArray(child)) {
      // RECURSIVELY flatten nested arrays
      child.forEach((nested) => transformedChildren.push(handleChildrenSSR([nested])));
    } else {
      transformedChildren.push(child as string);
    }
  }

  return transformedChildren.join("");
}
