export {};

declare global {
  namespace JSX {
    type Element = false | undefined | null | string | number | Node | Element[] | (() => Element);

    interface IntrinsicElements {
      [elemName: string]: Record<string, any> & { key?: string | number };
    }

    interface ElementChildrenAttribute {
      children: object;
    }

    interface ElementAttributesProperty {
      props: object; // Enables props validation
    }

    interface Attributes {
      key?: string | number;
    }

    type LibraryManagedAttributes<_C, P> = P & { key?: string | number };
  }
}
