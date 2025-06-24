export { F as Fragment } from './fragment-DsTMuH_N.js';

type Computed<T> = {
    readonly value: T;
};
declare function computed<T>(getter: () => T): Computed<T>;

declare function effect(fn: () => void): () => void;

type ResourceReturn<T> = {
    readonly loading: boolean;
    readonly error: Error | null;
    readonly data: T;
    refetch: () => Promise<void>;
    mutate: (newValue: T) => void;
};
declare function resource<T>(fetcher: () => Promise<T>): ResourceReturn<T>;

type State<T> = {
    value: T;
};
declare function state<T>(initialValue: T): State<T>;
declare function state<T = undefined>(): State<T | undefined>;

type Store<T extends object> = T;
declare function store<T extends object>(initialObject: T): Store<T>;

declare function untrack<T>(fn: () => T): T;

type DestroyFn = () => void;
declare function onDestroy(fn: () => void): void;

type MountFn = () => void | (() => void);
declare function onMount(fn: () => () => void): void;
declare function onMount(fn: () => void): void;

/**
 * create a root element
 *
 * @param $root - The root element.
 * @param App - The app to render.
 */
declare function createRoot($root: HTMLElement, App: () => JSX.Element): void;

/**
 * create a loop component
 *
 * @param items - The items to loop through.
 * @returns The loop component.
 */
declare function loop<T>(items: T[]): {
    each: (children: (item: T, index: State<number>) => JSX.Element) => any;
};

/**
 * create a suspense component
 *
 * @param props - The properties of the component.
 * @returns The suspense component.
 */
declare function Suspense(props: {
    fallback: JSX.Element;
    children: JSX.Element;
}): Text;

/**
 * log the JSX elements
 *
 * @param $nodes - The nodes to log.
 * @returns The nodes that are not text nodes and are not in the componentRootNodes set.
 */
declare function logJsx($nodes: Node[]): Node | Node[];

/**
 * memoize a function
 *
 * @param fn - The function to memoize.
 * @returns The memoized function.
 */
declare function memo<T>(fn: () => T): () => T;

/**
 * unwraps proxy objects
 *
 * @param value - The value to unwrap.
 * @returns The unwrapped value.
 */
declare function unwrap<T>(value: any): Partial<T>;

export { Suspense, computed, createRoot, effect, logJsx, loop, memo, onDestroy, onMount, resource, state, store, untrack, unwrap };
export type { Computed, DestroyFn, MountFn, State };
