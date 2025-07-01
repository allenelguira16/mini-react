import { memo } from "~/util";

export function lazy<M extends Record<string, any>, K extends keyof M = "default">(
  loader: () => Promise<M>,
  namedExport?: K,
): () => any {
  let component: any;
  let error: any;
  let promise: Promise<void> | null = null;

  const key = namedExport ?? ("default" as K);

  const getComponent = memo(() => {
    if (component) return component;
    if (error) throw error;
    if (!promise) {
      promise = loader()
        .then((mod) => {
          if (!(key in mod)) {
            throw new Error(`lazy(): Export "${String(key)}" not found in module`);
          }
          component = mod[key];
        })
        .catch((err) => {
          error = err;
        });
    }

    throw promise;
  });

  return () => getComponent;
}
