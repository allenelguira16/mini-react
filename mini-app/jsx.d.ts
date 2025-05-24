declare namespace JSX {
  type Element = HTMLElement | DocumentFragment;

  interface IntrinsicElements {
    [elemName: string]: any; // allow any HTML tag
  }

  interface ElementChildrenAttribute {
    children: {}; // supports children prop
  }
}
