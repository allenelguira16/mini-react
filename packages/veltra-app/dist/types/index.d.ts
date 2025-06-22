type MountFn = () => void | (() => void);
declare function onMount(fn: () => () => void): void;
declare function onMount(fn: () => void): void;

type DestroyFn = () => void;
declare function onDestroy(fn: () => void): void;

type Store<T extends object> = T;
declare function store<T extends object>(initialObject: T): Store<T>;

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

declare function resource<T>(fetcher: () => Promise<T>): {
    readonly loading: boolean;
    readonly error: any;
    readonly data: T;
    refetch: () => Promise<void>;
    mutate(newValue: T): void;
};

declare function loop<T>(items: T[]): {
    each: (children: (item: T, index: State<number>) => JSX.Element) => any;
};

declare function Suspense(props: {
    fallback: JSX.Element;
    children: JSX.Element;
}): Text;

declare function createRoot($root: HTMLElement, App: () => JSX.Element): void;

declare function memo<T>(fn: () => T): () => T;

declare function unwrap<T>(value: any): Partial<T>;

declare function logJsx($nodes: Node[]): Node | Node[];

export { Suspense, computed, createRoot, effect, logJsx, loop, memo, onDestroy, onMount, resource, state, store, untrack, unwrap };
export type { Computed, DestroyFn, MountFn, State };
