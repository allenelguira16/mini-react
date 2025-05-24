import { h, Fragment } from "./render";

// export { h as jsx, h as jsxs, Fragment } from "./main";

export const jsx = (type: any, { children = [], ...props }: any) =>
  h(type, props, Array.isArray(children) ? children : [children]);

export const jsxs = jsx;
export { Fragment };
