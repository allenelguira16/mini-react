declare function onMount(fn: () => () => void): void;
declare function onMount(fn: () => void): void;

declare function onDestroy(fn: () => void): void;

type State<T> = {
    value: T;
};
declare function state<T>(initialValue: T): State<T>;
declare function state<T = undefined>(): State<T | undefined>;

type Subscriber = {
    (): void;
    subscriptions?: Set<Subscriber>;
};

declare function effect(fn: Subscriber): () => void;

declare function computed<T>(fn: () => T): {
    readonly value: T;
};

declare function untrack<T>(fn: () => T): T;

declare function h(type: string | Function, props: Record<string, any>, children: JSX.Element[]): any;

declare function hSSR(type: string | Function, props: Record<string, any>, children: JSX.Element[]): any;

declare function createRoot($root: HTMLElement, app: JSX.Element): void;

declare function loop<T>(items: T[]): {
    each: (children: (item: T, index: State<number>) => JSX.Element) => any;
};

declare function memo<T>(fn: () => T): () => T;

declare function cleanLog($nodes: Node[]): Node | Node[];

export { cleanLog, computed, createRoot, effect, h, hSSR, loop, memo, onDestroy, onMount, state, untrack };
export type { State };
