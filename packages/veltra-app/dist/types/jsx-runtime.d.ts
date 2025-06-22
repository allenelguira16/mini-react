export { F as Fragment } from './fragment-DsTMuH_N.js';

// TODO: add specific types not just any
declare global {
  namespace JSX {
    type Element = undefined | string | number | Node | Element[] | (() => Element);

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: object;
    }
  }
}

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
declare const jsx: (type: string | ((props: Record<string, any>) => any), { children, ...props }: Record<string, any>) => any;

export { jsx, jsx as jsxs };
