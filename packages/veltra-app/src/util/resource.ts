import { effect, state } from "~/state";

export function resource<T, A>(fetcher: (...args: A[]) => Promise<T>) {
  const loading = state(true);
  const error = state<any>(null);
  const version = state(0); // trigger reactivity
  let promise = state<Promise<void>>(); // reactive promise holder
  let value: T | undefined;

  const refetch = () => {
    loading.value = true;

    promise.value = new Promise<void>((resolve, reject) => {
      fetcher()
        .then((result) => {
          value = result;
          loading.value = false;
          error.value = null;
          version.value++; // trigger dependent effects
          resolve();
        })
        .catch((err) => {
          error.value = err;
          loading.value = false;
          version.value++; // trigger even on error
          reject(err);
        });
    });

    return promise.value;
  };

  // Initial fetch immediately
  effect(() => {
    refetch();
  });

  return {
    get value() {
      version.value; // make value reactive to version
      const pendingPromise = promise.value;

      if (loading.value) throw pendingPromise;
      if (error.value) throw error.value;
      // console.log(pendingPromise, loading.value);

      return value as T;
    },
    loading,
    error,
    refetch,

    // ✅ mutate with version bump (trigger effects/reactors)
    set mutate(newValue: T) {
      value = newValue;
      version.value++; // trigger reactivity
    },
  };
}
