import { IS_SSR } from "./const";
import { h, hSSR } from "./render";
import { toArray } from "./util";

import "./jsx.d";

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
const jsx = (type: any, { children = [], ...props }: any) => {
  if (IS_SSR) {
    return hSSR(type, props, toArray(children));
  }

  return h(type, props, toArray(children));
};

function Fragment({ children }: { children: any[] }) {
  return children;
}

export { jsx, jsx as jsxs, Fragment };
