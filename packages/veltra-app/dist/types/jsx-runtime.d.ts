// TODO: add specific types not just any
declare global {
  namespace JSX {
    type Element =
      | undefined
      | string
      | number
      | Node
      | Element[]
      | (() => Element);

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

declare const jsx: (type: any, { children, ...props }: any) => any;
declare function Fragment({ children }: {
    children: any[];
}): any[];

export { Fragment, jsx, jsx as jsxs };
