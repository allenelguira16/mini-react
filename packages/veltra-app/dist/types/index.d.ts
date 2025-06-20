type MountFn = () => void | (() => void);
declare function onMount(fn: () => () => void): void;
declare function onMount(fn: () => void): void;

type DestroyFn = () => void;
declare function onDestroy(fn: () => void): void;

type State<T> = {
    value: T;
};
declare function state<T>(initialValue: T): State<T>;
declare function state<T = undefined>(): State<T | undefined>;

declare function effect(fn: () => void): () => void;

type Computed<T> = {
    readonly value: T;
};
declare function computed<T>(getter: () => T): Computed<T>;

declare function untrack<T>(fn: () => T): T;

declare function resource<T, A>(fetcher: (...args: A[]) => Promise<T>): {
    readonly value: T;
    loading: State<boolean>;
    error: State<any>;
    refetch: () => Promise<void>;
    mutate: T;
};

declare function Suspense(props: {
    fallback: JSX.Element;
    children: JSX.Element;
}): Text;

declare function createRoot($root: HTMLElement, App: () => JSX.Element): void;

declare function loop<T>(items: T[]): {
    each: (children: (item: T, index: State<number>) => JSX.Element) => any;
};

declare function memo<T>(fn: () => T): () => T;

declare function logJsx($nodes: Node[]): Node | Node[];

export { Suspense, computed, createRoot, effect, logJsx, loop, memo, onDestroy, onMount, resource, state, untrack };
export type { Computed, DestroyFn, MountFn, State };
