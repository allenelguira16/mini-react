import { effect, state, untrack } from "~/reactivity";

export type ResourceReturn<T> = {
  readonly loading: boolean;
  readonly error: Error | null;
  readonly data: T;
  refetch: () => Promise<void>;
  mutate: (newValue: T) => void;
};

/**
 * Create a reactive resource
 *
 * @param fetcher - The function to fetch the data.
 * @returns The resource.
 */
export function resource<T>(fetcher: () => Promise<T>): ResourceReturn<T> {
  const loading = state(true);

  let error = null as Error | null;
  let data = undefined as T | undefined;
  let realPromise: Promise<T> | null = null;
  let promiseStatus = "pending" as "pending" | "fulfilled" | "rejected";

  const version = state(0);

  const refetch = async () => {
    loading.value = true;
    error = null;
    data = undefined as T | undefined;
    promiseStatus = "pending";
    realPromise = fetcher();

    realPromise
      .then((result) => {
        data = result;
        error = null;
        loading.value = false;
        promiseStatus = "fulfilled";
        // untrack(() => version.value++);
      })
      .catch((err) => {
        data = undefined as T | undefined;
        error = err;
        promiseStatus = "rejected";
        loading.value = false;
        // untrack(() => version.value++);
      });

    untrack(() => version.value++);
  };

  effect(() => {
    refetch();
  });

  return {
    get loading() {
      return loading.value;
    },
    get error() {
      return error;
    },
    get data() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      version.value;
      if (promiseStatus === "pending") throw realPromise;
      if (promiseStatus === "rejected") throw error;

      return data as T;
    },
    refetch,
    mutate(newValue: T) {
      data = newValue;
      version.value++;
    },
  };
}
