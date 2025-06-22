import { effect, store } from "~/reactivity";

export function resource<T>(fetcher: () => Promise<T>) {
  const data = store({
    loading: true,
    error: null as any,
    data: undefined as T,
  });

  let realPromise: Promise<void> | null = null;

  const refetch = () => {
    data.loading = true;

    realPromise = new Promise<void>((resolve, reject) => {
      fetcher()
        .then((result) => {
          data.data = result;
          data.loading = false;
          data.error = null;
          resolve();
        })
        .catch((err) => {
          data.error = err;
          data.loading = false;
          reject(err);
        });
    });

    return realPromise;
  };

  effect(() => {
    refetch();
  });

  return {
    get loading() {
      return data.loading;
    },
    get error() {
      return data.error;
    },
    get data() {
      if (data.loading) throw realPromise;
      if (!data.loading && data.error) throw data.error;
      return data.data;
    },
    refetch,
    mutate(newValue: T) {
      data.data = newValue;
    },
  };
}
