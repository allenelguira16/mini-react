// TODO: add specific types not just any
declare namespace JSX {
  type Element =
    | string
    | number
    | Function
    | HTMLElement
    | DocumentFragment
    | (string | number | HTMLElement)[];

  interface IntrinsicElements {
    [elemName: string]: any;
  }

  interface ElementChildrenAttribute {
    children: {};
  }
}
