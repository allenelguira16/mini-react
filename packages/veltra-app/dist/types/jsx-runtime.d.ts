export { F as Fragment } from './fragment-DHIT8DJc.js';

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

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
declare const jsx: (type: string | ((props: any) => any), { children, ...props }: Record<string, any>, key?: () => string) => any;

export { jsx, jsx as jsxs };
