import { h, Fragment } from "./render";

// Transform jsx to use h
export const jsx = (type: any, { children = [], ...props }: any) =>
  h(type, props, Array.isArray(children) ? children : [children]);

export const jsxs = jsx;
export { Fragment };
