import "./jsx.d";

import { IS_SSR } from "./const";
import { Fragment, h, hSSR } from "./render";
import { toArray } from "./util";

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
const jsx = (
  type: string | ((props: Record<string, any>) => any),
  { children = [], ...props }: Record<string, any>,
) => {
  if (IS_SSR) {
    return hSSR(type, props, toArray(children));
  }

  return h(type, props, toArray(children));
};

export { Fragment, jsx, jsx as jsxs };
